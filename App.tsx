import { InquiryStage } from './types';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Inquiry Studio</h1>
        <p className="text-gray-600">Structured Research & Thesis Development Platform</p>
        <div className="mt-4">
          <h2 className="font-semibold">Current Stage: {InquiryStage.ProblemSpace}</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
