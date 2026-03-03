import { useCallback } from "react";
import { useState } from "react"


export const useLoading = () => {
    const [isLoading, setLoading] = useState(false);
    const onLoading = useCallback(() => { setLoading(true) });
    const stopLoading = useCallback(() => { setLoading(false) })
    return { isLoading, onLoading, stopLoading }
}