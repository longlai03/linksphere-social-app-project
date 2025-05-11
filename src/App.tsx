import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router/Router'

function App() {
  return (
    <BrowserRouter>
      <div className='w-full h-full'>
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
