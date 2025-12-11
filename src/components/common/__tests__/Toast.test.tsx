import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  cleanup,
} from '@testing-library/react'
import {
  ToastContainer,
  showToast,
  dismissToast,
  clearAllToasts,
} from '../Toast'

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    act(() => {
      clearAllToasts()
    })
  })

  afterEach(() => {
    act(() => {
      clearAllToasts()
      jest.runAllTimers()
    })
    jest.useRealTimers()
    cleanup()
  })

  describe('ToastContainer', () => {
    it('renders the toast container with notifications label', () => {
      render(<ToastContainer />)
      const container = document.querySelector('[aria-label="Notifications"]')
      expect(container).toBeInTheDocument()
    })

    it('is positioned at bottom center of viewport', () => {
      render(<ToastContainer />)
      const container = document.querySelector('[aria-label="Notifications"]')
      expect(container).toHaveClass(
        'fixed',
        'bottom-6',
        'left-1/2',
        '-translate-x-1/2',
      )
    })

    it('has correct z-index for overlay', () => {
      render(<ToastContainer />)
      const container = document.querySelector('[aria-label="Notifications"]')
      expect(container).toHaveClass('z-50')
    })
  })

  describe('showToast', () => {
    it('displays a success toast', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Operation successful!')
      })

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Operation successful!')).toBeInTheDocument()
    })

    it('displays an error toast', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('error', 'Something went wrong!')
      })

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
    })

    it('displays an info toast', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('info', 'This is informational')
      })

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('This is informational')).toBeInTheDocument()
    })

    it('returns a unique toast ID', () => {
      render(<ToastContainer />)

      let id1: string = ''
      let id2: string = ''

      act(() => {
        id1 = showToast('success', 'First toast')
        id2 = showToast('success', 'Second toast')
      })

      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })

    it('displays multiple toasts simultaneously', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'First message')
        showToast('error', 'Second message')
        showToast('info', 'Third message')
      })

      expect(screen.getAllByRole('alert')).toHaveLength(3)
    })
  })

  describe('Toast styling', () => {
    it('applies success background color', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Success!')
      })

      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('bg-[#34C759]')
    })

    it('applies error background color', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('error', 'Error!')
      })

      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('bg-[#FF3B30]')
    })

    it('applies info background color', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('info', 'Info!')
      })

      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('bg-[#007AFF]')
    })
  })

  describe('Toast dismissal', () => {
    it('auto-dismisses after default duration (3 seconds)', async () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Auto dismiss test')
      })

      expect(screen.getByText('Auto dismiss test')).toBeInTheDocument()

      // Fast forward through the animation and auto-dismiss
      act(() => {
        jest.advanceTimersByTime(3200) // 3000ms duration + 200ms animation
      })

      await waitFor(() => {
        expect(screen.queryByText('Auto dismiss test')).not.toBeInTheDocument()
      })
    })

    it('uses custom duration when provided', async () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Custom duration', 1000)
      })

      expect(screen.getByText('Custom duration')).toBeInTheDocument()

      // Should still be visible before custom duration
      act(() => {
        jest.advanceTimersByTime(500)
      })
      expect(screen.getByText('Custom duration')).toBeInTheDocument()

      // Fast forward past custom duration + animation
      act(() => {
        jest.advanceTimersByTime(800)
      })

      await waitFor(() => {
        expect(screen.queryByText('Custom duration')).not.toBeInTheDocument()
      })
    })

    it('dismisses when dismiss button is clicked', async () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Click to dismiss')
      })

      const dismissButton = screen.getByRole('button', { name: /dismiss/i })
      fireEvent.click(dismissButton)

      // Wait for animation to complete
      act(() => {
        jest.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(screen.queryByText('Click to dismiss')).not.toBeInTheDocument()
      })
    })
  })

  describe('dismissToast', () => {
    it('dismisses a specific toast by ID', async () => {
      render(<ToastContainer />)

      let toastId: string = ''

      act(() => {
        toastId = showToast('success', 'Target toast')
        showToast('info', 'Other toast')
      })

      expect(screen.getByText('Target toast')).toBeInTheDocument()
      expect(screen.getByText('Other toast')).toBeInTheDocument()

      act(() => {
        dismissToast(toastId)
        jest.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(screen.queryByText('Target toast')).not.toBeInTheDocument()
      })
      expect(screen.getByText('Other toast')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has role="alert" for screen readers', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Accessible toast')
      })

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('has aria-live="polite" for announcements', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Polite toast')
      })

      const toast = screen.getByRole('alert')
      expect(toast).toHaveAttribute('aria-live', 'polite')
    })

    it('dismiss button has accessible label', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Test toast')
      })

      expect(
        screen.getByRole('button', { name: /dismiss notification/i }),
      ).toBeInTheDocument()
    })

    it('dismiss button is focusable', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Focusable test')
      })

      const dismissButton = screen.getByRole('button', { name: /dismiss/i })
      dismissButton.focus()
      expect(dismissButton).toHaveFocus()
    })
  })

  describe('Animation states', () => {
    it('applies enter animation classes', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Animation test')
      })

      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('transition-all', 'duration-200', 'ease-out')
    })

    it('starts with hidden state and becomes visible', () => {
      render(<ToastContainer />)

      act(() => {
        showToast('success', 'Visibility test')
      })

      // Initially hidden (before enter animation)
      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('opacity-0')

      // After enter animation triggers
      act(() => {
        jest.advanceTimersByTime(50)
      })

      expect(toast).toHaveClass('opacity-100')
    })
  })
})
