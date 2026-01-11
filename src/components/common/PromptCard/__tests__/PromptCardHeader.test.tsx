import { render, screen } from '@testing-library/react'
import PromptCardHeader from '../PromptCardHeader'

describe('PromptCardHeader', () => {
  it('renders left side component', () => {
    render(
      <PromptCardHeader
        LeftSideComponent={<div>Left Content</div>}
        RightSideComponent={<div>Right Content</div>}
      />,
    )

    expect(screen.getByText('Left Content')).toBeInTheDocument()
  })

  it('renders right side component', () => {
    render(
      <PromptCardHeader
        LeftSideComponent={<div>Left Content</div>}
        RightSideComponent={<div>Right Content</div>}
      />,
    )

    expect(screen.getByText('Right Content')).toBeInTheDocument()
  })

  it('renders as header element', () => {
    const { container } = render(
      <PromptCardHeader
        LeftSideComponent={<div>Left</div>}
        RightSideComponent={<div>Right</div>}
      />,
    )

    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('renders both sides simultaneously', () => {
    render(
      <PromptCardHeader
        LeftSideComponent={<button>Action Left</button>}
        RightSideComponent={<button>Action Right</button>}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Action Left' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Action Right' }),
    ).toBeInTheDocument()
  })

  it('handles complex children components', () => {
    const LeftComponent = (
      <div>
        <span>Date</span>
        <span>Tag</span>
      </div>
    )
    const RightComponent = (
      <div>
        <button>Copy</button>
        <button>Delete</button>
      </div>
    )

    render(
      <PromptCardHeader
        LeftSideComponent={LeftComponent}
        RightSideComponent={RightComponent}
      />,
    )

    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Tag')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })
})
