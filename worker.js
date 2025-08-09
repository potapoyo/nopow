// Workerスクリプト
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const videoId = url.searchParams.get('v');
    
    if (!videoId) {
      return new Response('Please provide a "v" parameter in the URL.', { status: 400 });
    }

    const API_KEY = env.YOUTUBE_API_KEY; // APIキーをWorkerのSecretsに保存する
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        const title = item.snippet.title;
        const artist = item.snippet.channelTitle; // チャンネル名をアーティストとして扱う
        
        return new Response(`${title} / ${artist}`, {
          headers: { 'Content-Type': 'text/plain' }
        });
      } else {
        return new Response('Video not found.', { status: 404 });
      }
    } catch (error) {
      return new Response('An error occurred.', { status: 500 });
    }
  },
};

