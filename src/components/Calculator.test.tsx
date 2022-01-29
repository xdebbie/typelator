import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Calculator, { calcExpression } from './Calculator'

describe('<Calculator />', () => {
    it('shows numbers', () => {
        render(<Calculator />)
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        numbers.forEach(n => {
            expect(screen.getByText(n.toString())).toBeInTheDocument()
        })
    })

    it('shows calculation operators', () => {
        render(<Calculator />)
        const calcOperators = ['+', '-', 'x', '/', '=', 'Clear']
        calcOperators.forEach(operator => {
            expect(screen.getByText(operator.toString())).toBeInTheDocument()
        })
    })

    it('renders the inputs', () => {
        render(<Calculator />)
        const inputs = ['History', 'Result']
        inputs.forEach(title => {
            expect(screen.getByTitle(title)).toBeInTheDocument()
        })
    })

    it('renders the inputs disabled', () => {
        render(<Calculator />)
        const inputs = ['History', 'Result']
        inputs.forEach(title => {
            expect(screen.getByTitle(title)).toBeDisabled()
        })
    })

    it('can clear the display', async () => {
        render(<Calculator />)
        const one = screen.getByText('1')
        const two = screen.getByText('2')
        const plus = screen.getByText('+')
        const equals = screen.getByText('=')
        const clear = screen.getByText('Clear')
        fireEvent.click(one)
        fireEvent.click(plus)
        fireEvent.click(two)
        fireEvent.click(equals)
        fireEvent.click(clear)

        const history = await screen.findByTitle('History')
        expect(
            (
                history as HTMLElement & {
                    value: string
                }
            ).value
        ).toBe('')

        const result = await screen.findByTitle('Result')
        expect(
            (
                result as HTMLElement & {
                    value: string
                }
            ).value
        ).toBe('')
    })

    it('calculates correctly the expression (0.1 + 0.2 = 0.3)', async () => {
        render(<Calculator />)
        const zero = screen.getByText('0')
        const one = screen.getByText('1')
        const two = screen.getByText('2')
        const decimal = screen.getByText('.')
        const plus = screen.getByText('+')
        const equals = screen.getByText('=')
        fireEvent.click(zero)
        fireEvent.click(decimal)
        fireEvent.click(one)
        fireEvent.click(plus)
        fireEvent.click(zero)
        fireEvent.click(decimal)
        fireEvent.click(two)
        fireEvent.click(equals)

        const result = await screen.findByTitle('Result')

        expect(
            (
                result as HTMLElement & {
                    value: string
                }
            ).value
        ).toBe('0.3')
    })

    it('calculates correctly the expression (1 - 0.9 = 0.1)', async () => {
        render(<Calculator />)
        const zero = screen.getByText('0')
        const one = screen.getByText('1')
        const nine = screen.getByText('9')
        const decimal = screen.getByText('.')
        const minus = screen.getByText('-')
        const equals = screen.getByText('=')
        fireEvent.click(one)
        fireEvent.click(minus)
        fireEvent.click(zero)
        fireEvent.click(decimal)
        fireEvent.click(nine)
        fireEvent.click(equals)

        const result = await screen.findByTitle('Result')

        expect(
            (
                result as HTMLElement & {
                    value: string
                }
            ).value
        ).toBe('0.1')
    })

    it('calculates correctly the expression (3 x 0.3 = 0.9)', async () => {
        render(<Calculator />)
        const zero = screen.getByText('0')
        const three = screen.getByText('3')
        const decimal = screen.getByText('.')
        const times = screen.getByText('x')
        const equals = screen.getByText('=')
        fireEvent.click(three)
        fireEvent.click(times)
        fireEvent.click(zero)
        fireEvent.click(decimal)
        fireEvent.click(three)
        fireEvent.click(equals)

        const result = await screen.findByTitle('Result')

        expect(
            (
                result as HTMLElement & {
                    value: string
                }
            ).value
        ).toBe('0.9')
    })
})

describe('calcExpression', () => {
    it('correctly sums', () => {
        expect(calcExpression('0.1+0.2')).toBe(0.3)
        expect(calcExpression('15+14')).toBe(29)
        expect(calcExpression('100+100')).toBe(200)
    })

    it('correctly subtracts', () => {
        expect(calcExpression('1-0.9')).toBe(0.1)
        expect(calcExpression('10-1')).toBe(9)
        expect(calcExpression('100-101')).toBe(-1)
    })

    it('correctly multiplies', () => {
        expect(calcExpression('3×0.3')).toBe(0.9)
        expect(calcExpression('10×0')).toBe(0)
        expect(calcExpression('11×-3')).toBe(-33)
    })

    it('correctly divides', () => {
        expect(calcExpression('1÷1')).toBe(1)
        expect(calcExpression('100÷2')).toBe(50)
        expect(calcExpression('144÷14.4')).toBe(10)
    })

    it('throws an error if the expression is divided by 0', () => {
        const errorWatch = jest.spyOn(console, 'error')
        expect(calcExpression('1÷0')).toBe(undefined)
        expect(errorWatch).toHaveBeenCalledTimes(1)
    })

    it('handles multiple operations', () => {
        expect(calcExpression('9+3-2×10÷2')).toBe(2)
    })

    it('handles trailing operator', () => {
        expect(calcExpression('9+3-2×10÷2-')).toBe(2)
    })

    it('handles empty expression', () => {
        expect(calcExpression('')).toBe(undefined)
    })
})
