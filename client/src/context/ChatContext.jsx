import { createContext, useContext, useReducer, useCallback } from 'react';

const ChatContext = createContext(null);

const initialState = {
  conversations: [],
  activeId: null,
  messageCount: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'NEW_CONVERSATION': {
      const id = crypto.randomUUID();
      return {
        ...state,
        conversations: [{ id, messages: [], createdAt: new Date() }, ...state.conversations],
        activeId: id,
      };
    }
    case 'ADD_MESSAGE': {
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === state.activeId
            ? { ...c, messages: [...c.messages, action.message] }
            : c
        ),
        messageCount: state.messageCount + 1,
      };
    }
    case 'SET_ACTIVE':
      return { ...state, activeId: action.id };
    case 'RESET_COUNT':
      return { ...state, messageCount: 0 };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeConversation = state.conversations.find(c => c.id === state.activeId);

  const newConversation = useCallback(() => dispatch({ type: 'NEW_CONVERSATION' }), []);
  const addMessage = useCallback(msg => dispatch({ type: 'ADD_MESSAGE', message: msg }), []);
  const setActive = useCallback(id => dispatch({ type: 'SET_ACTIVE', id }), []);

  return (
    <ChatContext.Provider value={{
      conversations: state.conversations,
      activeConversation,
      messageCount: state.messageCount,
      newConversation,
      addMessage,
      setActive,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
