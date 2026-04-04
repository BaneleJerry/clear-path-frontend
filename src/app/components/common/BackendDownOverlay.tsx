import { AlertCircle, RefreshCw } from 'lucide-react';

export default function BackendDownOverlay() {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-6">
                <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">System Unavailable</h1>
            <p className="text-gray-600 max-w-sm mb-8">
                We're having trouble connecting to the Clear-Path servers.
                Please check your internet connection or try again later.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <RefreshCw className="mr-2 h-4 w-4" /> Retry Connection
            </button>
        </div>
    );
}