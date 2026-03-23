
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import ChartPie from '~icons/heroicons/chart-pie-solid'

const AnalysisButton = () => {
  const navigate = useNavigate()

  const toAnalysis = useCallback(() => {
    navigate('/analysis')

  }, [navigate])

  return (
    <button
      type="button"
      onClick={toAnalysis}
      className="flex items-center justify-center rounded-md p-0.5 text-lg text-text-muted outline-none transition-colors duration-300 ease-in-out hover:bg-accent-primary-soft hover:text-accent-primary"
    >
      <ChartPie className="my-icon" />
    </button>
  )
}

export default AnalysisButton
