# Enhanced compare_offers Tool

## Overview

The `compare_offers` tool has been enhanced to provide comprehensive analysis of multiple property offers using both algorithmic scoring and GPT-powered analysis. This tool is designed for seller-side experiences, helping real estate professionals and sellers make informed decisions about multiple offers.

## Features

### 🤖 GPT-Powered Analysis
- **Intelligent Summary**: AI-generated summary of which offer is strongest and why
- **Contextual Analysis**: Considers market conditions, buyer qualifications, and offer terms
- **Natural Language**: Human-readable explanations of offer strengths and weaknesses

### 📊 Comprehensive Scoring
- **Multi-factor Ranking**: Price, contingencies, closing timeline, financing, and buyer sentiment
- **Weighted Algorithm**: 50% price, 30% contingencies, 15% closing timeline, 5% buyer sentiment
- **Normalized Scoring**: All offers scored 0-100 for easy comparison

### 📋 Pros/Cons Table
- **Detailed Analysis**: Each offer gets a comprehensive pros/cons breakdown
- **Key Factors**: Price, financing, contingencies, closing timeline, earnest money
- **Overall Assessment**: Quick evaluation (Strong/Good/Weak offer)

## Input Format

```json
{
  "offers": [
    {
      "price": 850000,
      "close_date": "2024-02-15T00:00:00",
      "contingencies": ["inspection", "financing"],
      "buyer_letter": "We love this home and are excited to make it our own!",
      "financing": "Conventional",
      "earnest_money": 25000,
      "buyer_name": "John and Sarah Smith"
    }
  ]
}
```

### Required Fields
- `price`: Offer amount in dollars
- `close_date`: ISO format date string

### Optional Fields
- `contingencies`: Array of contingency types
- `buyer_letter`: Personal letter from buyer
- `financing`: Type of financing (Cash, Conventional, FHA, etc.)
- `earnest_money`: Earnest money amount
- `buyer_name`: Name of the buyer(s)

## Output Format

```json
{
  "status": "success",
  "comparison_id": "comparison_20240201_143022",
  "message": "Compared 4 offers with GPT analysis",
  "data": {
    "comparison_id": "comparison_20240201_143022",
    "total_offers": 4,
    "ranked_offers": [
      {
        "price": 880000,
        "close_date": "2024-03-01T00:00:00",
        "contingencies": ["inspection", "appraisal", "sale_of_current_home"],
        "buyer_letter": "We are very interested in this property.",
        "financing": "FHA",
        "earnest_money": 15000,
        "buyer_name": "Lisa Chen",
        "score": 85.2
      }
    ],
    "summary": "The highest offer at $880,000 from Lisa Chen stands out for its strong price, though it comes with multiple contingencies including sale of current home. The cash offer from Mike Johnson at $820,000 with no contingencies provides the most certainty for a quick, smooth closing.",
    "pros_cons_table": [
      {
        "rank": 1,
        "price": "$880,000",
        "pros": ["Highest price", "Conventional financing"],
        "cons": ["3 contingencies", "Long closing timeline"],
        "overall_assessment": "Strong offer"
      }
    ],
    "generated_at": "2024-02-01T14:30:22"
  }
}
```

## Usage Examples

### Basic Usage
```python
from client_tools import ClientTools

client_tools = ClientTools()
result = await client_tools.compare_offers(offers_list)
```

### Frontend Integration
```typescript
import { fetchFromMCPPost } from '@/utils/fetchFromMCP';

const response = await fetchFromMCPPost('clientside', {
  action: 'compare_offers',
  offers: offersData
});

if (response.success) {
  const analysis = response.data;
  console.log('GPT Summary:', analysis.summary);
  console.log('Pros/Cons:', analysis.pros_cons_table);
}
```

## Testing

Run the test script to see the tool in action:

```bash
cd backend
python test_compare_offers.py
```

This will demonstrate the tool with sample offer data and show:
- GPT-generated summary
- Ranked offers with scores
- Detailed pros/cons analysis

## Configuration

### OpenAI Integration
The tool requires an OpenAI API key for GPT analysis:

```bash
export OPENAI_API_KEY="your-api-key-here"
export OPENAI_MODEL="gpt-4o"  # Optional, defaults to gpt-4o
```

### Fallback Behavior
If GPT analysis fails or is unavailable, the tool falls back to:
- Basic algorithmic summary
- Rule-based pros/cons analysis
- Standard scoring system

## Error Handling

The tool gracefully handles:
- Missing or invalid offer data
- OpenAI API failures
- Network connectivity issues
- Malformed date strings
- Missing optional fields

## Performance

- **Async Operation**: Non-blocking GPT analysis
- **Timeout Protection**: 30-second default timeout for API calls
- **Caching**: Results cached by comparison ID
- **Fallback**: Always provides analysis even if GPT fails

## Integration Points

This tool feeds into:
- **Seller Dashboard**: Display offer comparisons
- **Agent Tools**: Provide insights for client consultations
- **Reporting**: Generate offer analysis reports
- **Decision Support**: Help sellers choose the best offer 