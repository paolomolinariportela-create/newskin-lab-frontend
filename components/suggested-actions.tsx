"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
};

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
  // Configuramos as ações inspiradas no Hextom e focadas na Nuvemshop
  const suggestedActions = [
    {
      title: "💰 Ajustar Preços",
      text: "Quero aumentar o preço de todos os produtos da loja em 10% e arredondar para .90",
    },
    {
      title: "📝 Editar Títulos",
      text: "Adicione a palavra 'PROMOÇÃO' ao final do título de todos os produtos acima de R$ 150",
    },
    {
      title: "📦 Zerar Estoque",
      text: "Zere o estoque de todos os produtos da categoria [CATEGORIA] que estão sem venda",
    },
    {
      title: "🏷️ Gerenciar Tags",
      text: "Adicione a tag 'Nova Coleção' em todos os produtos que foram criados esta semana",
    },
  ];

  return (
    <div
      className="grid w-full gap-2 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((action, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={action.title}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className="h-auto w-full whitespace-normal p-3 text-left"
            onClick={(suggestion) => {
              // Pegamos apenas o texto da sugestão, mas mantemos o título visual
              const textToSend = suggestedActions.find(a => a.title === suggestion)?.text || suggestion;
              
              window.history.pushState({}, "", `/chat/${chatId}`);
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: textToSend }],
              });
            }}
            suggestion={action.title}
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold text-blue-600">{action.title}</span>
              <span className="text-xs text-muted-foreground line-clamp-2">
                {action.text}
              </span>
            </div>
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) return false;
    return true;
  }
);
