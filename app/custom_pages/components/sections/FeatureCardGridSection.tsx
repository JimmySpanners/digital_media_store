import React, { useState } from 'react';
import { FeatureCardGridSection as FeatureCardGridSectionType, FeatureCard } from '../../types/sections';
import MediaLibrary from '@/components/media/MediaLibrary';
import { Button } from '@/components/ui/button';
import { MediaLightbox } from './MediaLightbox';
import { TextStyleEditor, TextStyle } from './TextStyleEditor';

interface Props {
  section: FeatureCardGridSectionType;
  isEditMode: boolean;
  onSectionChange: (section: FeatureCardGridSectionType) => void;
  speakText: (text: string) => void;
}

export const FeatureCardGridSection: React.FC<Props> = ({ section, isEditMode, onSectionChange, speakText }) => {
  const [editingMediaIdx, setEditingMediaIdx] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handleCardChange = (idx: number, card: Partial<FeatureCard>) => {
    const newCards = [...section.cards];
    newCards[idx] = { ...newCards[idx], ...card };
    onSectionChange({ ...section, cards: newCards });
  };

  const handleCardTextStyleChange = (idx: number, style: TextStyle) => {
    const newCards = [...section.cards];
    newCards[idx] = { ...newCards[idx], textStyle: { ...newCards[idx].textStyle, ...style } };
    onSectionChange({ ...section, cards: newCards });
  };

  const handleAddCard = () => {
    const newCard: FeatureCard = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      mediaUrl: '',
      mediaType: 'image',
      title: '',
      description: '',
      ctaText: 'Learn More',
      ctaUrl: '',
      ctaOpenInNewTab: false,
    };
    onSectionChange({ ...section, cards: [...section.cards, newCard] });
  };

  const handleRemoveCard = (idx: number) => {
    const newCards = section.cards.filter((_, i) => i !== idx);
    onSectionChange({ ...section, cards: newCards });
  };

  const handleNumCardsChange = (num: number) => {
    let newCards = [...section.cards];
    if (num > newCards.length) {
      for (let i = newCards.length; i < num; i++) {
        newCards.push({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
          mediaUrl: '',
          mediaType: 'image',
          title: '',
          description: '',
          ctaText: 'Learn More',
          ctaUrl: '',
          ctaOpenInNewTab: false,
        });
      }
    } else {
      newCards = newCards.slice(0, num);
    }
    onSectionChange({ ...section, numCards: num, cards: newCards });
  };

  return (
    <div className="space-y-6">
      {isEditMode && (
        <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded text-xs">
          <strong>Section ID:</strong> {section.id}
          <span className="ml-2 text-gray-500">(Use this for nav links)</span>
        </div>
      )}
      {isEditMode && (
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <label className="block text-sm font-medium text-gray-700">Cards per row:</label>
          <select
            value={section.numCards}
            onChange={e => handleNumCardsChange(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[2, 3, 4].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <Button onClick={handleAddCard} type="button">Add Card</Button>
        </div>
      )}
      <div className={`grid gap-8`} style={{ gridTemplateColumns: `repeat(${section.numCards}, minmax(0, 1fr))` }}>
        {section.cards.map((card, idx) => (
          <div key={card.id} className="relative bg-white rounded-lg shadow p-6 flex flex-col">
            {isEditMode && (
              <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => handleRemoveCard(idx)}>Remove</Button>
            )}
            <div className="mb-4">
              {card.mediaUrl ? (
                card.mediaType === 'video' ? (
                  isEditMode ? (
                    <video src={card.mediaUrl} className="w-full h-40 object-cover rounded" controls />
                  ) : (
                    <div className="cursor-pointer" onClick={() => card.mediaUrl && setLightboxIdx(idx)}>
                      <video src={card.mediaUrl} className="w-full h-40 object-cover rounded" controls />
                    </div>
                  )
                ) : (
                  isEditMode ? (
                    <img src={card.mediaUrl} alt={card.title} className="w-full h-40 object-cover rounded" />
                  ) : (
                    <div className="cursor-pointer" onClick={() => card.mediaUrl && setLightboxIdx(idx)}>
                      <img src={card.mediaUrl} alt={card.title} className="w-full h-40 object-cover rounded" />
                    </div>
                  )
                )
              ) : isEditMode ? (
                <Button variant="outline" onClick={() => setEditingMediaIdx(idx)}>Add Media</Button>
              ) : null}
              {isEditMode && editingMediaIdx === idx && (
                <MediaLibrary
                  isDialog
                  type="all"
                  onCloseAction={() => setEditingMediaIdx(null)}
                  onSelectAction={(url, type) => {
                    handleCardChange(idx, { mediaUrl: url, mediaType: type });
                    setEditingMediaIdx(null);
                  }}
                />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {isEditMode ? (
                <input
                  type="text"
                  value={card.title}
                  onChange={e => handleCardChange(idx, { title: e.target.value })}
                  className="border rounded px-2 py-1 mb-2"
                  placeholder="Card Title"
                />
              ) : (
                <h3
                  className="text-lg font-bold mb-2"
                  style={card.textStyle ? {
                    color: card.textStyle.fontColor,
                    fontSize: card.textStyle.fontSize,
                    fontStyle: card.textStyle.fontStyle,
                    fontWeight: card.textStyle.fontStyle === 'bold' ? 'bold' : undefined,
                    textShadow: card.textStyle.textShadow ? `${card.textStyle.textShadow.offsetX || '2px'} ${card.textStyle.textShadow.offsetY || '2px'} ${card.textStyle.textShadow.blur || '4px'} ${card.textStyle.textShadow.color || '#000000'}` : undefined,
                    WebkitTextStroke: card.textStyle.textOutline ? `${card.textStyle.textOutline.width || '2px'} ${card.textStyle.textOutline.color || '#ffffff'}` : undefined,
                    background: card.textStyle.textBackground ? card.textStyle.textBackground.color : undefined,
                    opacity: card.textStyle.textBackground ? card.textStyle.textBackground.opacity : undefined,
                    borderRadius: card.textStyle.textBackground ? card.textStyle.textBackground.borderRadius : undefined,
                    padding: card.textStyle.textBackground ? card.textStyle.textBackground.padding : undefined,
                    backdropFilter: card.textStyle.textBackground && card.textStyle.textBackground.blur ? `blur(${card.textStyle.textBackground.blur})` : undefined,
                    WebkitBackdropFilter: card.textStyle.textBackground && card.textStyle.textBackground.blur ? `blur(${card.textStyle.textBackground.blur})` : undefined,
                  } : {}}
                >
                  {card.title}
                </h3>
              )}
              {isEditMode ? (
                <textarea
                  value={card.description}
                  onChange={e => handleCardChange(idx, { description: e.target.value })}
                  className="border rounded px-2 py-1 mb-2"
                  placeholder="Card Description"
                  rows={2}
                />
              ) : (
                <p
                  className="text-gray-600 mb-2"
                  style={card.textStyle ? {
                    color: card.textStyle.fontColor,
                    fontSize: card.textStyle.fontSize,
                    fontStyle: card.textStyle.fontStyle,
                    fontWeight: card.textStyle.fontStyle === 'bold' ? 'bold' : undefined,
                    textShadow: card.textStyle.textShadow ? `${card.textStyle.textShadow.offsetX || '2px'} ${card.textStyle.textShadow.offsetY || '2px'} ${card.textStyle.textShadow.blur || '4px'} ${card.textStyle.textShadow.color || '#000000'}` : undefined,
                    WebkitTextStroke: card.textStyle.textOutline ? `${card.textStyle.textOutline.width || '2px'} ${card.textStyle.textOutline.color || '#ffffff'}` : undefined,
                    background: card.textStyle.textBackground ? card.textStyle.textBackground.color : undefined,
                    opacity: card.textStyle.textBackground ? card.textStyle.textBackground.opacity : undefined,
                    borderRadius: card.textStyle.textBackground ? card.textStyle.textBackground.borderRadius : undefined,
                    padding: card.textStyle.textBackground ? card.textStyle.textBackground.padding : undefined,
                    backdropFilter: card.textStyle.textBackground && card.textStyle.textBackground.blur ? `blur(${card.textStyle.textBackground.blur})` : undefined,
                    WebkitBackdropFilter: card.textStyle.textBackground && card.textStyle.textBackground.blur ? `blur(${card.textStyle.textBackground.blur})` : undefined,
                  } : {}}
                >
                  {card.description}
                </p>
              )}
              {isEditMode && (
                <TextStyleEditor
                  value={card.textStyle || {}}
                  onChange={style => handleCardTextStyleChange(idx, style)}
                  label="Card Text Style"
                />
              )}
            </div>
            <div className="mt-4">
              {isEditMode ? (
                <>
                  <input
                    type="text"
                    value={card.ctaText}
                    onChange={e => handleCardChange(idx, { ctaText: e.target.value })}
                    className="border rounded px-2 py-1 mb-2 w-full"
                    placeholder="CTA Button Text"
                  />
                  <input
                    type="text"
                    value={card.ctaUrl}
                    onChange={e => handleCardChange(idx, { ctaUrl: e.target.value })}
                    className="border rounded px-2 py-1 mb-2 w-full"
                    placeholder="CTA Link URL"
                  />
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!card.ctaOpenInNewTab}
                      onChange={e => handleCardChange(idx, { ctaOpenInNewTab: e.target.checked })}
                    />
                    Open in new tab
                  </label>
                </>
              ) : (
                card.ctaUrl && (
                  <Button asChild className="w-full mt-2">
                    <a href={card.ctaUrl} target={card.ctaOpenInNewTab ? '_blank' : undefined} rel={card.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}>
                      {card.ctaText || 'Learn More'}
                    </a>
                  </Button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Media Lightbox */}
      <MediaLightbox
        open={lightboxIdx !== null && !!section.cards[lightboxIdx]?.mediaUrl}
        mediaUrl={lightboxIdx !== null ? section.cards[lightboxIdx]?.mediaUrl : ''}
        mediaType={lightboxIdx !== null ? section.cards[lightboxIdx]?.mediaType : 'image'}
        onClose={() => setLightboxIdx(null)}
      />
    </div>
  );
}; 