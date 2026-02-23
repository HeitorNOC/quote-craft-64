import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

interface EstimateData {
  service: 'flooring' | 'cleaning';
  type: 'estimate' | 'schedule';
  contact: { name: string; email: string; phone: string; observations?: string };
  address: string;
  zipCode: string;
  totalSqFt?: number;
  coverage?: 'whole' | 'specific';
  material?: string;
  cleaningType?: string;
  frequency?: string;
  price?: number;
  roomDetails?: string; // "Bedroom (200) → Hardwood, Kitchen (150) → Tile"
  materialNames?: string; // "Hardwood | Tile" or "Bedroom: Hardwood | Kitchen: Tile"
  materialUrls?: string; // "https://... | https://..."
}

async function getSheets() {
  const credentialsBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!credentialsBase64) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT not configured');
  }

  const credentials = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString());

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function appendToSheet(sheetName: string, values: any[][]) {
  const sheets = await getSheets();
  
  // Choose spreadsheet ID based on service type
  const isFlooring = sheetName.includes('Flooring');
  const spreadsheetId = isFlooring 
    ? process.env.GOOGLE_SPREADSHEET_ID_FLOORING
    : process.env.GOOGLE_SPREADSHEET_ID_CLEANING;

  if (!spreadsheetId) {
    throw new Error(`GOOGLE_SPREADSHEET_ID_${isFlooring ? 'FLOORING' : 'CLEANING'} not configured`);
  }

  // Extract material names and URLs from roomDetails if not provided
  const processedValues = values.map((row) => {
    // For flooring: [timestamp, name, email, phone, address, zip, totalSqFt, coverage, roomDetails, materialNames, materialUrls, price]
    // For cleaning: [timestamp, name, email, phone, address, zip, totalSqFt, coverage, roomDetails, frequency, materialNames, materialUrls, price]
    return row;
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${sheetName}'!A:Z`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: processedValues,
    },
  });
}

async function ensureSheetExists(sheetName: string) {
  const sheets = await getSheets();
  
  // Choose spreadsheet ID based on service type
  const isFlooring = sheetName.includes('Flooring');
  const spreadsheetId = isFlooring 
    ? process.env.GOOGLE_SPREADSHEET_ID_FLOORING
    : process.env.GOOGLE_SPREADSHEET_ID_CLEANING;

  if (!spreadsheetId) {
    throw new Error(`GOOGLE_SPREADSHEET_ID_${isFlooring ? 'FLOORING' : 'CLEANING'} not configured`);
  }

  try {
    // Try to get the sheet metadata to verify it exists
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetExists = response.data.sheets?.some((sheet) => sheet.properties?.title === sheetName);

    if (!sheetExists) {
      // Create the sheet if it doesn't exist
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
    }
  } catch (error) {
    console.error('Error checking sheet:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data: EstimateData = req.body;

    // Validate required fields
    if (!data.service || !data.type || !data.contact || !data.address || !data.zipCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toLocaleString('pt-BR');
    let sheetName = '';
    let rowData: any[] = [];

    if (data.service === 'flooring') {
      sheetName = data.type === 'estimate' ? 'Flooring Estimates' : 'Flooring Schedule';
      rowData = [
        [
          timestamp,
          data.contact.name,
          data.contact.email,
          data.contact.phone,
          data.address,
          data.zipCode,
          data.totalSqFt || 'N/A',
          data.coverage || 'N/A',
          data.roomDetails || 'N/A',
          data.material || 'N/A',
          data.materialNames || 'N/A',
          data.materialUrls || 'N/A',
          data.price || 'N/A',
          data.contact.observations || 'N/A',
        ],
      ];
    } else if (data.service === 'cleaning') {
      sheetName = data.type === 'estimate' ? 'Cleaning Estimates' : 'Cleaning Schedule';
      rowData = [
        [
          timestamp,
          data.contact.name,
          data.contact.email,
          data.contact.phone,
          data.address,
          data.zipCode,
          data.totalSqFt || 'N/A',
          data.coverage || 'N/A',
          data.roomDetails || 'N/A',
          data.cleaningType || 'N/A',
          data.frequency || 'N/A',
          data.materialNames || 'N/A',
          data.materialUrls || 'N/A',
          data.price || 'N/A',
          data.contact.observations || 'N/A',
        ],
      ];
    }

    // Ensure sheet exists and append data
    await ensureSheetExists(sheetName);
    await appendToSheet(sheetName, rowData);

    return res.status(200).json({
      success: true,
      message: `${data.service} ${data.type} saved successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to save estimate. Please try again later.',
    });
  }
}
