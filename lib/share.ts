/**
 * Utility functions for sharing and copying links
 */

export function getRecruiterProfileUrl(
  recruiterId: string,
  country: string,
  baseUrl?: string
): string {
  const url = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${url}/${country}/recruiters/${recruiterId}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    }
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}

export async function shareContent(
  title: string,
  text: string,
  url: string
): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    } else {
      // Fallback: copy to clipboard
      return await copyToClipboard(url);
    }
  } catch (err) {
    // User cancelled or error occurred
    if ((err as Error).name !== "AbortError") {
      console.error("Failed to share:", err);
    }
    return false;
  }
}

export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

