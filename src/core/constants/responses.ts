export const GlobalResponse = (options: {
    path?: string;
    data?: any;
    statusCode?: number;
    messages?: any[];
}) => (
    process.env.NODE_ENV === 'DEVELOPMENT' ? 
    { ...options, timestamp: Date.now() } : 
    { statusCode: options.statusCode, messages: options.messages, data: options.data }
);
