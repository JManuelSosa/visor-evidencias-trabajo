import { usePresignedUrl as realPresignedUrl } from '@/composables/files/usePresignedUrl';
import { uploadToR2 as realUploadToR2 } from '../DirectUpload';

// Imports de los mocks (descomentar para activar sandbox)
import { usePresignedUrl as mockPresignedUrl } from "@/services/mock/usePresignedUrl.mock"
import { configureMockPresignedUrl, resetMockPresignedUrlConfig } from '@/services/mock/usePresignedUrl.mock';
import { uploadToR2 as mockUploadToR2 } from '@/services/mock/mockUploadToR2';
import { configureMockUpload, resetMockUploadConfig } from '@/services/mock/mockUploadToR2';

const USE_MOCKS = import.meta.env.DEV && import.meta.env.VITE_USE_UPLOAD_MOCKS === 'true';

export const presignedUrlService = USE_MOCKS ? mockPresignedUrl() : realPresignedUrl();

export const uploadToR2 = USE_MOCKS ? mockUploadToR2 : realUploadToR2;

// Exponer funciones de configuración en desarrollo
if (USE_MOCKS) {
    (window as any).__UPLOAD_MOCKS__ = {
        configurePresignedUrl: configureMockPresignedUrl,
        configureUpload: configureMockUpload,
        resetAll: () => {
            resetMockPresignedUrlConfig();
            resetMockUploadConfig();
            console.log('Mocks reseteados a valores por defecto');
        }
    };
    console.log('Upload Mocks activados. Usa window.__UPLOAD_MOCKS__ para configurar escenarios');
}
