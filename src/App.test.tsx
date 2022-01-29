import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders typelator', () => {
    render(<App />)
    // tests whether the text 'typelator' is being rendered somewhere
    const typelatorElement = screen.getByText(/typelator/i)
    expect(typelatorElement).toBeInTheDocument()
})
