import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://sman12kotatangsel.sch.id/wp-json/wp/v2/media?per_page=100"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
)

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        media_list = json.loads(response.read().decode('utf-8'))
        
    print(f"Success, found {len(media_list)} media items")
    count = 0
    for item in media_list:
        url = item.get('source_url', '')
        title = item.get('title', {}).get('rendered', '')
        if url.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            count += 1
            print(f"[{count}] Title: {title}")
            print(f"URL: {url}")
            print("-" * 40)
except Exception as e:
    print("Failed to query WP REST API:", str(e))
