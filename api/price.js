export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker } = req.query;
  if(!ticker) return res.status(400).json({error:'ticker required'});
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=3mo&interval=1wk&includePrePost=false`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    if(!r.ok) return res.status(r.status).json({error:`Yahoo returned ${r.status}`});
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=900'); // 15 min cache
    res.json(data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
