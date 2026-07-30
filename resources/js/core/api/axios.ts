import axios from "axios";

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.interceptors.request.use((config) => {

    const isInternalRequest = !config.url?.startsWith('http') || config.url.startsWith(window.location.origin);

    if (isInternalRequest) {
        const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        if (token?.content) {
            config.headers['X-CSRF-TOKEN'] = token.content;
        }
    }

    return config;
});

export default axios;
