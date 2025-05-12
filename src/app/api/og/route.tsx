import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get the searchParams from the request
    const { searchParams } = new URL(request.url);
    
    // Get the title from the searchParams or use a default
    const title = searchParams.get('title') || 'Aashish Tangnami';
    const subtitle = searchParams.get('subtitle') || 'Data Professional & Software Engineer';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f3f3',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '90%',
              height: '80%',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 60,
                fontWeight: 'bold',
                color: '#1B2021',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {'<'} A.T {'>'}
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: '#1B2021',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 30,
                color: '#424242',
                textAlign: 'center',
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
