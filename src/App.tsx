import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import theme from 'styled-theming'
import { useTheme } from './utils/ThemeManager'
import Calculator, { themes } from './components/Calculator'
import Footer from './components/Footer'
import { device } from './utils/variables'
import brush from './assets/brush.svg'

const backgroundColour = theme('mode', {
    white: `linear-gradient(
        243.18deg,
        #ffffff 0%,
        rgba(142, 142, 142, 0.81) 100%
    )`,
    lollipop: `linear-gradient(
        243.18deg,
        #ef4250 0%,
        rgba(81, 24, 241, 0.81) 100%
    )`,
    dark: `linear-gradient(
        243.18deg,
        #000000 0%,
        rgba(48, 48, 48, 0.92) 100%
    )`,
    forest: `linear-gradient(
        243.18deg,
        #004358 0%,
        rgba(31, 223, 0, 0.92) 100%
    );`,
})

const Main = styled.div`
    align-items: center;
    background: ${backgroundColour};
    color: white;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: all 2s;

    @media ${device.tablet} {
        justify-content: center;
    }
`

const Wrapper = styled.div`
    flex: 1 0 auto;
    margin-top: 50px;
    position: relative;
`

const Themes = styled.div`
    background: ${themes.frameColour};
    box-shadow: 8px 8px 40px 15px rgba(46, 46, 46, 0.15);
    border-radius: 25px;
    color: ${themes.labelColour};
    font-size: 14px;
    font-weight: 200;
    line-height: 40px;
    margin-bottom: 20px;
    padding: 0 10px 10px 10px;
    text-align: center;
    user-select: none;
    width: 290px;

    @media ${device.tablet} {
        font-size: 20px;
        padding: 10px 20px 20px 20px;
        width: unset;
    }

    @media ${device.desktop} {
        display: flex;
        flex-direction: column;
        left: -170px;
        margin-bottom: 0;
        position: absolute;
    }
`

const Icon = styled.img`
    margin-bottom: -6px;
    width: 25px;

    @media ${device.tablet} {
        margin-bottom: -8px;
        width: 30px;
    }

    @media ${device.desktop} {
        height: 40px;
        margin-bottom: 0;
        margin-top: 10px;
        width: 100%;
    }
`

const Button = styled.button`
    background: ${themes.buttonColour};
    border: none;
    border-radius: 25px;
    box-shadow: none;
    color: ${themes.buttonFontColour};
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 300;
    margin-left: 5px;
    margin-top: 10px;
    padding: 10px;

    &:hover {
        background: ${themes.displayColour};
    }

    &:focus,
    &:active {
        outline: none;
    }

    @media ${device.tablet} {
        font-size: 18px;
        margin-left: 10px;
        padding: 10px 20px;
    }

    @media ${device.desktop} {
        margin-left: 0;
    }
`

function App() {
    const theme = useTheme()
    return (
        <ThemeProvider theme={{ mode: theme.mode }}>
            <Main>
                <Wrapper>
                    <Calculator>
                        <Themes>
                            <Icon src={brush} alt="Paint icon" />
                            <Button onClick={() => theme.setTheme('white')}>
                                white
                            </Button>
                            <Button onClick={() => theme.setTheme('lollipop')}>
                                lollipop
                            </Button>
                            <Button onClick={() => theme.setTheme('dark')}>
                                dark
                            </Button>
                            <Button onClick={() => theme.setTheme('forest')}>
                                forest
                            </Button>
                        </Themes>
                    </Calculator>
                </Wrapper>
                <Footer />
            </Main>
        </ThemeProvider>
    )
}

export default App
