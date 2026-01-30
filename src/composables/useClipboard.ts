import { ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export function useClipboard() {
  const isCopying = ref(false)
  const lastError = ref<string | null>(null)

  const copyForWeChat = async (markdown: string): Promise<boolean> => {
    if (!markdown.trim()) {
      lastError.value = '没有内容可复制'
      return false
    }

    isCopying.value = true
    lastError.value = null

    try {
      marked.setOptions({
        breaks: true,
        gfm: true
      })

      const html = marked.parse(markdown) as string
      const cleanHtml = DOMPurify.sanitize(html, {
        ADD_TAGS: ['img', 'style'],
        ADD_ATTR: ['style', 'src', 'alt', 'width', 'height']
      })

      const wechatHtml = convertToWeChatFormat(cleanHtml)

      const blob = new Blob([wechatHtml], { type: 'text/html' })
      const textBlob = new Blob([markdown], { type: 'text/plain' })

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': textBlob
        })
      ])

      return true
    } catch (err) {
      console.error('富文本复制失败，降级到纯文本:', err)
      
      // Fallback to plain text
      try {
        await navigator.clipboard.writeText(markdown)
        lastError.value = null
        return true
      } catch (e) {
        lastError.value = '复制失败，请手动选择复制'
        return false
      }
    } finally {
      isCopying.value = false
    }
  }

  const convertToWeChatFormat = (html: string): string => {
    return `
      <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        line-height: 1.8;
        color: #1a1a1a;
        padding: 20px;
      ">
        ${html}
      </div>
    `
  }

  return {
    isCopying,
    lastError,
    copyForWeChat
  }
}
