import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import IconBook from '~icons/bxs/book'

const ErrorBookButton = () => {
  const navigate = useNavigate()

  const toErrorBook = useCallback(() => {
    navigate('/error-book')
  }, [navigate])

  return (
    <button
      type="button"
      onClick={toErrorBook}
      className="flex items-center justify-center rounded-md p-0.5 text-lg text-text-muted outline-none transition-colors duration-300 ease-in-out hover:bg-accent-primary-soft hover:text-accent-primary"
    >
      <IconBook className="my-icon" />
    </button>
  )
}

export default ErrorBookButton
