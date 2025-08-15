'use client'

import React from 'react'
import { Check } from 'lucide-react'

interface ContentBlock {
  type: 'text' | 'list' | 'scenario' | 'metric'
  content: string
  items?: string[]
}

interface AdditionalSectionProps {
  title: string
  type: string
  icon: string
  parsedContent?: ContentBlock[]
  rawContent?: string
}

// Theme colors for different section types
const getThemeColors = (type: string) => {
  const themes = {
    example: {
      titleColor: 'text-green-700',
      bulletColor: 'bg-green-100 text-green-800',
      accentColor: 'text-green-600',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50'
    },
    metrics: {
      titleColor: 'text-blue-700', 
      bulletColor: 'bg-blue-100 text-blue-800',
      accentColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50'
    },
    tips: {
      titleColor: 'text-yellow-700',
      bulletColor: 'bg-yellow-100 text-yellow-800', 
      accentColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50'
    },
    practices: {
      titleColor: 'text-purple-700',
      bulletColor: 'bg-purple-100 text-purple-800',
      accentColor: 'text-purple-600', 
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50'
    },
    troubleshooting: {
      titleColor: 'text-red-700',
      bulletColor: 'bg-red-100 text-red-800',
      accentColor: 'text-red-600',
      borderColor: 'border-red-200', 
      bgColor: 'bg-red-50'
    },
    notes: {
      titleColor: 'text-orange-700',
      bulletColor: 'bg-orange-100 text-orange-800',
      accentColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50'
    },
    features: {
      titleColor: 'text-indigo-700',
      bulletColor: 'bg-indigo-100 text-indigo-800',
      accentColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      bgColor: 'bg-indigo-50'
    },
    process: {
      titleColor: 'text-cyan-700',
      bulletColor: 'bg-cyan-100 text-cyan-800', 
      accentColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
      bgColor: 'bg-cyan-50'
    },
    generic: {
      titleColor: 'text-gray-700',
      bulletColor: 'bg-gray-100 text-gray-800',
      accentColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      bgColor: 'bg-gray-50'
    }
  }
  
  return themes[type as keyof typeof themes] || themes.generic
}

// Render different content block types
const renderContentBlock = (block: ContentBlock, theme: ReturnType<typeof getThemeColors>, index: number) => {
  switch (block.type) {
    case 'list':
      if (!block.items) return null
      
      // If there's a content header, render it first
      const hasHeader = block.content && block.content.trim().length > 0
      
      return (
        <div key={index}>
          {hasHeader && (
            <h4 className={`font-semibold mb-3 ${theme.titleColor}`}>
              {block.content}
            </h4>
          )}
          <ul className="space-y-2">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start space-x-3">
                <Check className={`flex-shrink-0 w-4 h-4 mt-0.5 ${theme.accentColor}`} />
                <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>
      )
    
    case 'metric':
      if (!block.items) return null
      return (
        <div key={index}>
          {block.content && (
            <h4 className={`font-semibold mb-3 ${theme.titleColor}`}>
              {block.content}
            </h4>
          )}
          <ul className="space-y-2">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 bg-current ${theme.accentColor}`} />
                <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>
      )
    
    case 'scenario':
      return (
        <div key={index} className={`rounded-lg p-4 ${theme.bgColor} ${theme.borderColor} border`}>
          <div className="prose prose-gray prose-sm max-w-none">
            <div 
              className="text-gray-700 whitespace-pre-line" 
              dangerouslySetInnerHTML={{ __html: block.content }} 
            />
          </div>
        </div>
      )
    
    case 'text':
    default:
      // For text blocks, try to parse them as lists if they contain list-like content
      const textLines = block.content.split('\n').filter(line => line.trim())
      const listPattern = /^[-*•]\s+/
      const isListLike = textLines.length > 1 && textLines.filter(line => listPattern.test(line.trim())).length >= textLines.length * 0.5
      
      if (isListLike) {
        const items = textLines.map(line => line.replace(listPattern, '').trim()).filter(item => item)
        return (
          <ul key={index} className="space-y-2">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start space-x-3">
                <Check className={`flex-shrink-0 w-4 h-4 mt-0.5 ${theme.accentColor}`} />
                <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        )
      }
      
      return (
        <div key={index} className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.content }} />
      )
  }
}

export function AdditionalSectionRenderer({ title, type, icon, parsedContent, rawContent }: AdditionalSectionProps) {
  const theme = getThemeColors(type)
  
  return (
    <div>
      <h3 className={`text-lg font-semibold mb-4 ${theme.titleColor}`}>
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      
      <div className="space-y-4">
        {parsedContent && parsedContent.length > 0 ? (
          parsedContent.map((block, index) => renderContentBlock(block, theme, index))
        ) : (
          // Fallback to raw content with smart parsing
          (() => {
            if (!rawContent) return null
            
            // Try to parse raw content into lists
            const lines = rawContent.split('\n').map(line => line.trim()).filter(line => line.length > 0)
            const listPattern = /^[-*•]\s+/
            const isListContent = lines.filter(line => listPattern.test(line)).length >= lines.length * 0.4
            
            if (isListContent) {
              const items = lines.map(line => line.replace(listPattern, '').trim()).filter(item => item)
              return (
                <ul className="space-y-2">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <Check className={`flex-shrink-0 w-4 h-4 mt-0.5 ${theme.accentColor}`} />
                      <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              )
            }
            
            // Check for subsections with headers
            const hasSubheaders = rawContent.includes('**') && rawContent.includes(':')
            if (hasSubheaders) {
              const blocks = rawContent.split(/\n\s*\n/).filter(block => block.trim())
              return (
                <div className="space-y-4">
                  {blocks.map((block, blockIndex) => {
                    const trimmedBlock = block.trim()
                    
                    if (trimmedBlock.includes('**') && trimmedBlock.includes(':')) {
                      const lines = trimmedBlock.split('\n')
                      const headerLine = lines[0]
                      const contentLines = lines.slice(1).filter(line => line.trim())
                      
                      return (
                        <div key={blockIndex}>
                          <h4 className={`font-semibold mb-2 ${theme.titleColor}`}>
                            {headerLine.replace(/\*\*(.*?)\*\*/g, '$1').replace(':', '')}
                          </h4>
                          <ul className="space-y-1 ml-4">
                            {contentLines.map((line, lineIndex) => (
                              <li key={lineIndex} className="flex items-start space-x-2">
                                <div className={`flex-shrink-0 w-1 h-1 rounded-full mt-2 bg-current ${theme.accentColor}`} />
                                <span className="text-gray-700 text-sm">{line.replace(/^[-*•]\s*/, '')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    }
                    
                    return (
                      <div key={blockIndex} className="text-gray-700 whitespace-pre-line">
                        {trimmedBlock}
                      </div>
                    )
                  })}
                </div>
              )
            }
            
            // Default fallback with improved styling
            return (
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {rawContent}
              </div>
            )
          })()
        )}
      </div>
    </div>
  )
}