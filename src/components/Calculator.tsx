import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { evaluate } from 'mathjs'
import styled, { ThemeProvider } from 'styled-components'
import theme from 'styled-theming'
import { useTheme } from '../utils/ThemeManager'
import { device } from '../utils/variables'

export const themes = {
    frameColour: theme('mode', {
        white: 'rgba(255, 255, 255, 0.15)',
        lollipop: 'rgba(87, 87, 87, 0.35)',
        dark: 'rgba(0, 0, 0, 0.151)',
        forest: 'rgba(255, 255, 255, 0.25)',
    }),
    labelColour: theme('mode', {
        white: '#8E8E8E',
        lollipop: '#FFFFFF',
        dark: '#FFFFFF',
        forest: '#D1FFCA',
    }),
    displayColour: theme('mode', {
        white: 'rgba(255, 255, 255, 0.75)',
        lollipop: 'rgba(255, 255, 255, 0.65)',
        dark: 'rgba(36, 36, 36, 0.75)',
        forest: 'rgba(0, 36, 10, 0.75)',
    }),
    historyColour: theme('mode', {
        white: '#8E8E8E',
        lollipop: '#666666',
        dark: '#A0A0A0',
        forest: '#59CB00',
    }),
    resultColour: theme('mode', {
        white: '#676767',
        lollipop: '#3c3c3c',
        dark: '#FFFFFF',
        forest: '#D1FFCA',
    }),
    buttonColour: theme('mode', {
        white: 'rgba(239, 239, 239, 0.75)',
        lollipop: 'rgba(179, 179, 179, 0.65)',
        dark: 'rgba(53, 53, 53, 0.75)',
        forest: 'rgba(0, 69, 19, 0.75)',
    }),
    buttonFontColour: theme('mode', {
        white: '#ACAAAA',
        lollipop: '#FFFFFF',
        dark: '#FFFFFF',
        forest: '#D1FFCA',
    }),
}

const Frame = styled.div`
    background: ${themes.frameColour};
    border-radius: 25px;
    box-shadow: 8px 8px 40px 15px rgba(46, 46, 46, 0.15);
    padding: 20px 20px 20px 20px;
    position: relative;

    @media ${device.tablet} {
        padding: 20px 25px 25px 25px;
    }
`

const Label = styled.div`
    color: ${themes.labelColour};
    font-size: 24px;
    font-weight: 200;
    text-align: left;
    user-select: none;

    @media ${device.tablet} {
        font-size: 30px;
    }
`

const Display = styled.div`
    background: ${themes.displayColour};
    border-radius: 15px;
    height: 85px;
    margin-top: 20px;
    width: 230px;
    padding: 15px 20px;

    @media ${device.tablet} {
        width: 355px;
        padding: 20px 25px 25px 25px;
    }
`

const History = styled.input`
    background: none;
    border: none;
    color: ${themes.historyColour};
    -webkit-text-fill-color: ${themes.historyColour};
    font-family: 'Outfit', sans-serif;
    font-size: 26px;
    line-height: 32px;
    padding: 0;
    text-align: right;
    width: inherit;
`

const Result = styled.input`
    background: none;
    border: none;
    color: ${themes.resultColour};
    -webkit-text-fill-color: ${themes.resultColour};
    font-family: 'Outfit', sans-serif;
    font-size: 44px;
    line-height: 54px;
    padding: 0;
    text-align: right;
    width: inherit;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 60px);
    grid-template-rows: repeat(5, 60px);
    grid-gap: 10px;
    margin-top: 10px;

    @media ${device.tablet} {
        grid-template-columns: repeat(4, 90px);
        grid-template-rows: repeat(5, 90px);
        grid-gap: 15px;
        margin-top: 15px;
    }
`

const Button = styled.button`
    background: ${themes.buttonColour};
    border: none;
    border-radius: 15px;
    color: ${themes.buttonFontColour};
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 300;
    padding: 0;
    text-transform: uppercase;

    &:hover {
        background: ${themes.displayColour};
    }

    &:focus,
    &:active {
        outline: none;
    }

    &#clear {
        grid-column: 1 / 3;
        grid-row: 1 / 2;
    }

    &#equals {
        grid-column: 4 / 5;
        grid-row: 4 / 6;
    }

    &#zero {
        grid-column: 1 / 3;
        grid-row: 5 / 6;
    }

    @media ${device.tablet} {
        font-size: 44px;
    }
`

const Tooltip = styled.div`
    display: none;

    @media ${device.desktop} {
        background: ${themes.frameColour};
        border-radius: 100px;
        bottom: 0;
        display: inline-block;
        left: -40px;
        padding: 5px 12px;
        position: absolute;

        .tooltip__text {
            background-color: ${themes.resultColour};
            border-radius: 15px;
            bottom: 0;
            color: ${themes.displayColour};
            padding: 5px 10px;
            position: absolute;
            right: 40px;
            text-align: center;
            visibility: hidden;
            width: 210px;
            z-index: 1;

            code {
                background-color: rgba(0, 0, 0, 0.05);
                color: ${themes.displayColour};
                padding: 0 3px;
            }
        }

        &:hover  {
            .tooltip__text {
                visibility: visible;
            }
        }
    }
`

export const calcExpression = (expression: string) => {
    const mulRegex = /×/g
    const divRegex = /÷/g
    const divideByZero = /\/0/g

    let toEvaluate = expression.replace(mulRegex, '*').replace(divRegex, '/')

    const getLastChar = (str: string) => (str.length ? str[str.length - 1] : '')
    const isNumber = (str: string) => !isNaN(Number(str))
    const lastCharacterIsNaN = !isNumber(getLastChar(toEvaluate))

    try {
        if (!expression || expression.length === 0) {
            throw new Error('There is no expression!')
        } else if (divideByZero.test(toEvaluate)) {
            throw new Error('Can not divide by 0!')
        } else if (lastCharacterIsNaN) {
            toEvaluate = toEvaluate.slice(0, -1)
        }
        // Use 'evaluate' from @types/mathjs package instead of the vulnerable 'eval'
        // '+' is used to show '4' instead of '4.0000'
        const result: any = +evaluate(toEvaluate).toFixed(4)
        return result
    } catch (err) {
        console.error(err)
        return undefined
    }
}

const Calculator: React.FC = ({ children }) => {
    const theme = useTheme()

    const [value, setValue] = useState('')
    const [results, setResults] = useState('')

    // Every render will create a new function, so I shall recod them as my useEffect's dependencies with useCallback to avoid the useEffect 'missing dependency' error
    const calculate = useCallback(() => {
        const results = calcExpression(value)
        setResults(results)
    }, [value])

    const clearValue = useCallback(() => {
        setValue('')
        setResults('')
    }, [])

    const handleKeyDown = useCallback(
        ({ key }: KeyboardEvent) => {
            const setInputValue = (newInput: any) => {
                setValue(value => value.concat(newInput))
            }

            if (key === 'Escape') {
                clearValue()
            } else if (key === 'Enter' || key === '=') {
                // Enter key is not working, need to disable the buttons selection
                calculate()
            } else if (key === '/') {
                setInputValue('÷')
            } else if (key === 'x' || key === '*') {
                setInputValue('×')
            } else if (key === '+') {
                setInputValue('+')
            } else if (key === '-') {
                setInputValue('-')
            } else if (key === '.') {
                setInputValue('.')
            } else if (key === '0') {
                setInputValue('0')
            } else if (key === '1') {
                setInputValue('1')
            } else if (key === '2') {
                setInputValue('2')
            } else if (key === '3') {
                setInputValue('3')
            } else if (key === '4') {
                setInputValue('4')
            } else if (key === '5') {
                setInputValue('5')
            } else if (key === '6') {
                setInputValue('6')
            } else if (key === '7') {
                setInputValue('7')
            } else if (key === '8') {
                setInputValue('8')
            } else if (key === '9') {
                setInputValue('9')
            }
        },
        [calculate, clearValue]
    )

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    return (
        <ThemeProvider theme={{ mode: theme.mode }}>
            {children}
            <Frame>
                <Label>typelator v1</Label>
                <Display>
                    <History
                        type="text"
                        defaultValue={value}
                        title="History"
                        placeholder=""
                        disabled
                    />
                    <Result
                        type="text"
                        defaultValue={results}
                        title="Result"
                        placeholder=""
                        disabled
                    />
                </Display>
                <Grid>
                    <Button id="clear" data-testid="clear" onClick={clearValue}>
                        Clear
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('÷'))
                        }}
                        data-testid="/"
                    >
                        /
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('×'))
                        }}
                        data-testid="x"
                    >
                        x
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('7'))
                        }}
                    >
                        7
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('8'))
                        }}
                    >
                        8
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('9'))
                        }}
                    >
                        9
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('-'))
                        }}
                        data-testid="-"
                    >
                        -
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('4'))
                        }}
                    >
                        4
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('5'))
                        }}
                    >
                        5
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('6'))
                        }}
                    >
                        6
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('+'))
                        }}
                        data-testid="+"
                    >
                        +
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('1'))
                        }}
                    >
                        1
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('2'))
                        }}
                    >
                        2
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('3'))
                        }}
                    >
                        3
                    </Button>
                    <Button id="equals" data-testid="=" onClick={calculate}>
                        {'='}
                    </Button>
                    <Button
                        id="zero"
                        onClick={() => {
                            setValue(value.concat('0'))
                        }}
                    >
                        0
                    </Button>
                    <Button
                        onClick={() => {
                            setValue(value.concat('.'))
                        }}
                        data-testid="."
                    >
                        .
                    </Button>
                </Grid>
                <Tooltip>
                    ?
                    <span className="tooltip__text">
                        You can use your keyboard to calculate expressions.
                        Allowed inputs are all numerical keys, <code>.</code>,{' '}
                        <code>/</code>, <code>x</code>, <code>*</code>,{' '}
                        <code>-</code>, <code>+</code>, <code>{'='}</code>, and{' '}
                        <code>Esc</code> to clear.
                    </span>
                </Tooltip>
            </Frame>
        </ThemeProvider>
    )
}

export default Calculator
