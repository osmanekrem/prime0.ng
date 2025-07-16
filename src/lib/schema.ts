export type ResponseType<T> = ({
    success: true;
    data?: T;
    message?: string;
    error?: never;
}) | ({
    success: false;
    error: string;
    data?: never;
    message?: never;
})

