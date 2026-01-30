import { ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// 预览主题样式配置
const THEME_STYLES: Record<string, {
  fontFamily: string
  fontSize: string
  lineHeight: string
  color: string
  padding: string
  h1: { color: string; fontSize: string; fontWeight: string; margin: string }
  h2: { color: string; fontSize: string; fontWeight: string; margin: string; borderBottom: string }
  h3: { color: string; fontSize: string; fontWeight: string; margin: string }
  h4: { color: string; fontSize: string; fontWeight: string; margin: string }
  blockquote: { borderLeft: string; background: string; color: string; padding: string }
  pre: { background: string; padding: string; borderRadius: string }
  code: { background: string; padding: string; borderRadius: string; color: string }
}> = {
  default: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "16px",
    lineHeight: "1.9",
    color: "#1a1a1a",
    padding: "20px",
    h1: { color: "#e63946", fontSize: "2em", fontWeight: "700", margin: "1.5em 0 0.6em" },
    h2: { color: "#2a9d8f", fontSize: "1.6em", fontWeight: "600", margin: "1.4em 0 0.5em", borderBottom: "2px solid #1890ff" },
    h3: { color: "#e76f51", fontSize: "1.3em", fontWeight: "600", margin: "1.2em 0 0.5em" },
    h4: { color: "#264653", fontSize: "1.1em", fontWeight: "600", margin: "1em 0 0.4em" },
    blockquote: { borderLeft: "3px solid #1890ff", background: "#f5f5f5", color: "#666666", padding: "0.6em 1em" },
    pre: { background: "#f6f8fa", padding: "1.2em 1.4em", borderRadius: "8px" },
    code: { background: "#f6f8fa", padding: "0.2em 0.5em", borderRadius: "4px", color: "#e63946" }
  },
  academic: {
    fontFamily: "'Georgia', 'Times New Roman', 'Noto Serif SC', serif",
    fontSize: "16px",
    lineHeight: "2",
    color: "#2c2c2c",
    padding: "24px",
    h1: { color: "#8b4513", fontSize: "1.8em", fontWeight: "700", margin: "2em 0 0.8em" },
    h2: { color: "#654321", fontSize: "1.5em", fontWeight: "600", margin: "1.8em 0 0.6em", borderBottom: "1px solid #8b7355" },
    h3: { color: "#6b4423", fontSize: "1.25em", fontWeight: "600", margin: "1.5em 0 0.5em" },
    h4: { color: "#a0522d", fontSize: "1.1em", fontWeight: "600", margin: "1.2em 0 0.4em" },
    blockquote: { borderLeft: "4px solid #8b7355", background: "#faf8f5", color: "#555555", padding: "0.8em 1.5em" },
    pre: { background: "#f5f5f0", padding: "1.2em 1.4em", borderRadius: "4px" },
    code: { background: "#f0ebe3", padding: "0.15em 0.4em", borderRadius: "3px", color: "#8b4513" }
  },
  tech: {
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#e6e6e6",
    padding: "24px",
    h1: { color: "#ff6b6b", fontSize: "1.8em", fontWeight: "700", margin: "1.5em 0 0.5em" },
    h2: { color: "#4ecdc4", fontSize: "1.5em", fontWeight: "600", margin: "1.3em 0 0.5em", borderBottom: "1px solid #30363d" },
    h3: { color: "#c792ea", fontSize: "1.2em", fontWeight: "600", margin: "1.1em 0 0.4em" },
    h4: { color: "#f7b731", fontSize: "1em", fontWeight: "600", margin: "1em 0 0.3em" },
    blockquote: { borderLeft: "3px solid #f78166", background: "rgba(56, 139, 253, 0.1)", color: "#8b949e", padding: "0.6em 1em" },
    pre: { background: "#0d1117", padding: "1.2em 1.4em", borderRadius: "8px" },
    code: { background: "rgba(56, 139, 253, 0.15)", padding: "0.2em 0.5em", borderRadius: "4px", color: "#79c0ff" }
  },
  magazine: {
    fontFamily: "'Georgia', 'Noto Serif SC', serif",
    fontSize: "17px",
    lineHeight: "2.1",
    color: "#2c2c2c",
    padding: "32px",
    h1: { color: "#9c6644", fontSize: "2.2em", fontWeight: "400", margin: "2em 0 0.8em" },
    h2: { color: "#c9a962", fontSize: "1.6em", fontWeight: "400", margin: "1.8em 0 0.6em", borderBottom: "none" },
    h3: { color: "#8b6914", fontSize: "1.3em", fontWeight: "600", margin: "1.5em 0 0.5em" },
    h4: { color: "#a67c52", fontSize: "1.1em", fontWeight: "600", margin: "1.2em 0 0.4em" },
    blockquote: { borderLeft: "none", background: "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)", color: "#666666", padding: "1em 2em" },
    pre: { background: "linear-gradient(135deg, #f8f6f0 0%, #ebe7dc 100%)", padding: "1.2em 1.4em", borderRadius: "0" },
    code: { background: "transparent", padding: "0", borderRadius: "0", color: "#8b6914" }
  }
}

export function useClipboard() {
  const isCopying = ref(false)
  const lastError = ref<string | null>(null)

  const copyForWeChat = async (markdown: string, theme: string = 'default'): Promise<boolean> => {
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

      const wechatHtml = convertToWeChatFormat(cleanHtml, theme)

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

  const convertToWeChatFormat = (html: string, theme: string): string => {
    const themeStyle = THEME_STYLES[theme] || THEME_STYLES.default
    
    // 为复制的 HTML 添加内联样式
    const styledHtml = html
      .replace(/<h1[^>]*>/g, `<h1 style="color: ${themeStyle.h1.color}; font-size: ${themeStyle.h1.fontSize}; font-weight: ${themeStyle.h1.fontWeight}; margin: ${themeStyle.h1.margin}; line-height: 1.3;">`)
      .replace(/<h2[^>]*>/g, `<h2 style="color: ${themeStyle.h2.color}; font-size: ${themeStyle.h2.fontSize}; font-weight: ${themeStyle.h2.fontWeight}; margin: ${themeStyle.h2.margin}; padding-bottom: 0.3em; border-bottom: ${themeStyle.h2.borderBottom}; display: inline-block;">`)
      .replace(/<h3[^>]*>/g, `<h3 style="color: ${themeStyle.h3.color}; font-size: ${themeStyle.h3.fontSize}; font-weight: ${themeStyle.h3.fontWeight}; margin: ${themeStyle.h3.margin};">`)
      .replace(/<h4[^>]*>/g, `<h4 style="color: ${themeStyle.h4.color}; font-size: ${themeStyle.h4.fontSize}; font-weight: ${themeStyle.h4.fontWeight}; margin: ${themeStyle.h4.margin};">`)
      .replace(/<blockquote[^>]*>/g, `<blockquote style="border-left: ${themeStyle.blockquote.borderLeft}; margin: 1em 0; padding: ${themeStyle.blockquote.padding}; background: ${themeStyle.blockquote.background}; color: ${themeStyle.blockquote.color}; border-radius: 0 4px 4px 0;">`)
      .replace(/<pre[^>]*>/g, `<pre style="background: ${themeStyle.pre.background}; padding: ${themeStyle.pre.padding}; border-radius: ${themeStyle.pre.borderRadius}; overflow-x: auto; margin: 1em 0; border: 1px solid #e0e0e0;">`)
      .replace(/<code[^>]*>/g, `<code style="background: ${themeStyle.code.background}; padding: ${themeStyle.code.padding}; border-radius: ${themeStyle.code.borderRadius}; color: ${themeStyle.code.color}; font-size: 0.9em;">`)
      .replace(/<\/code>/g, '</code>')
      .replace(/<a /g, '<a style="color: #1890ff; text-decoration: none;" ')
      .replace(/<img /g, '<img style="max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0;" ')
      .replace(/<table[^>]*>/g, '<table style="width: 100%; border-collapse: collapse; margin: 1em 0; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">')
      .replace(/<th[^>]*>/g, '<th style="background: #f5f5f5; font-weight: 600; padding: 0.8em 1em; text-align: left; border-bottom: 1px solid #e0e0e0;">')
      .replace(/<td[^>]*>/g, '<td style="padding: 0.75em 1em; border-bottom: 1px solid #e0e0e0;">')
      .replace(/<hr[^>]*>/g, '<hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%); margin: 2em 0;" />')
      .replace(/<p[^>]*>/g, '<p style="margin: 0.9em 0; line-height: 1.8;">')
      .replace(/<ul[^>]*>/g, '<ul style="margin: 0.8em 0; padding-left: 1.5em;">')
      .replace(/<ol[^>]*>/g, '<ol style="margin: 0.8em 0; padding-left: 1.5em;">')
      .replace(/<li[^>]*>/g, '<li style="margin: 0.4em 0;">')

    return `
      <div style="
        font-family: ${themeStyle.fontFamily};
        font-size: ${themeStyle.fontSize};
        line-height: ${themeStyle.lineHeight};
        color: ${themeStyle.color};
        padding: ${themeStyle.padding};
        background: #ffffff;
      ">
        ${styledHtml}
      </div>
    `
  }

  return {
    isCopying,
    lastError,
    copyForWeChat
  }
}
