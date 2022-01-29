import React from 'react'

interface ThemeContext {
    mode: string
    setTheme: (theme: 'white' | 'lollipop' | 'dark' | 'forest') => void
}

const defaultMode = 'white'

export const ManageThemeContext: React.Context<ThemeContext> =
    React.createContext<ThemeContext>({
        mode: defaultMode,
        setTheme: () => {},
    })

export const useTheme = () => React.useContext(ManageThemeContext)

export const ThemeManager: React.FC = ({ children }) => {
    const [themeState, setThemeState] = React.useState({
        mode: defaultMode,
    })

    const setTheme = (theme: 'white' | 'lollipop' | 'dark' | 'forest') =>
        setThemeState({ mode: theme })

    return (
        <ManageThemeContext.Provider
            value={{
                mode: themeState.mode,
                setTheme: setTheme,
            }}
        >
            {children}
        </ManageThemeContext.Provider>
    )
}
