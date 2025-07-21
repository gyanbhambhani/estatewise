import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, just log the issue report (in production, you'd save to database)
    console.log('Issue Report Received:', {
      timestamp: new Date().toISOString(),
      ...body
    });
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      message: 'Issue report submitted successfully',
      id: `issue_${Date.now()}`
    });
    
  } catch (error) {
    console.error('Issue report error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to submit issue report'
    }, { status: 500 });
  }
}
