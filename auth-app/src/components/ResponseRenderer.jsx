// Helper function to format text with proper bullets
const formatResponse = (text) => {
  if (!text) return text;

  return text
    // Replace lines starting with * or - with bullet points
    .replace(/^\s*[\*\-]\s+(.+)$/gm, '• $1')
    // Replace **text** with bold
    .replace(/\*\*(.+?)\*\*/g, '$1')
    // Add extra spacing after paragraphs
    .replace(/\n\n/g, '\n\n');
};

// Component to render AI response with support for images
export default function ResponseRenderer({ response, darkMode }) {
  if (!response) return <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Response will appear here...</span>;

  // Check if response contains image data
  // Claude API returns images as base64 in content blocks
  if (typeof response === 'object' && response.type === 'image') {
    return (
      <div className="space-y-2">
        <img
          src={response.source?.type === 'base64' ? `data:${response.source.media_type};base64,${response.source.data}` : response.url}
          alt="AI generated content"
          className="max-w-full h-auto rounded-lg"
        />
      </div>
    );
  }

  // Check if response is an array (mixed content with text and images)
  if (Array.isArray(response)) {
    return (
      <div className="space-y-3">
        {response.map((item, index) => {
          if (item.type === 'text') {
            return (
              <div key={index} className="whitespace-pre-wrap">
                {formatResponse(item.text)}
              </div>
            );
          } else if (item.type === 'image') {
            return (
              <img
                key={index}
                src={item.source?.type === 'base64' ? `data:${item.source.media_type};base64,${item.source.data}` : item.url}
                alt="AI generated content"
                className="max-w-full h-auto rounded-lg border border-gray-600"
              />
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Check for markdown image syntax ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const hasImages = imageRegex.test(response);

  if (hasImages) {
    const parts = [];
    let lastIndex = 0;
    let match;

    // Reset regex
    imageRegex.lastIndex = 0;

    while ((match = imageRegex.exec(response)) !== null) {
      // Add text before image
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: response.substring(lastIndex, match.index)
        });
      }

      // Add image
      parts.push({
        type: 'image',
        alt: match[1],
        url: match[2]
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < response.length) {
      parts.push({
        type: 'text',
        content: response.substring(lastIndex)
      });
    }

    return (
      <div className="space-y-3">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div key={index} className="whitespace-pre-wrap">
                {formatResponse(part.content)}
              </div>
            );
          } else {
            return (
              <img
                key={index}
                src={part.url}
                alt={part.alt || "AI generated content"}
                className="max-w-full h-auto rounded-lg border border-gray-600"
              />
            );
          }
        })}
      </div>
    );
  }

  // Regular text response
  return <div className="whitespace-pre-wrap">{formatResponse(response)}</div>;
}
