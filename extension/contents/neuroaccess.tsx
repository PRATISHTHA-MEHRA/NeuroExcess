import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { calmThemeController } from "~features/calm-theme"
import { contrastFixerController } from "~features/contrast-fixer"
import { RulerOverlay } from "~features/reading-ruler/RulerOverlay"
import { skipLinksController } from "~features/skip-links"
import { ReadingBarOverlay } from "~features/syllable-highlighting/ReadingBarOverlay"
import { VoiceCommandsOverlay } from "~features/voice-commands/VoiceCommandsOverlay"
import {
  StandaloneReaderWidget,
  type StandaloneReaderHandle
} from "~features/syllable-highlighting/readerWidget"
import { DEFAULT_GLOBAL_SETTINGS } from "~lib/settings/defaults"
import type { GlobalSettings } from "~lib/settings/schema"
import { watchEffectiveSettings } from "~lib/settings/store"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*", "http://*/*", "file:///*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "neuroaccess-shadow-host"


export default function NeuroAccessRoot() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS)
  const standaloneReaderRef = useRef<StandaloneReaderHandle>(null)
  const runtime = globalThis.chrome.runtime

  useEffect(() => {
    const unsubscribe = watchEffectiveSettings(location.hostname, setSettings)
    return () => {
      unsubscribe()
      calmThemeController.remove()
      skipLinksController.remove()
    }
  }, [])

  // Triggered by the extension popup ("Read full page" button) and the context-menu item
  // ("Read selection aloud", registered in the background script) via chrome.runtime.sendMessage.
  useEffect(() => {
    function onMessage(message: { type?: string }) {
      if (message?.type === "neuroaccess:read-selection") {
        standaloneReaderRef.current?.readSelection()
      } else if (message?.type === "neuroaccess:read-page") {
        standaloneReaderRef.current?.readPage()
      }
    }
    runtime.onMessage.addListener(onMessage)

    function onLocalEvent(e: Event) {
      if (e.type === "neuroaccess:local-read-selection") {
        standaloneReaderRef.current?.readSelection()
      } else if (e.type === "neuroaccess:local-read-page") {
        standaloneReaderRef.current?.readPage()
      } else if (e.type === "neuroaccess:local-stop-reading") {
        standaloneReaderRef.current?.stop()
      } else if (e.type === "neuroaccess:local-pause-reading") {
        standaloneReaderRef.current?.pause()
      } else if (e.type === "neuroaccess:local-resume-reading") {
        standaloneReaderRef.current?.resume()
      }
    }

    window.addEventListener("neuroaccess:local-read-selection", onLocalEvent)
    window.addEventListener("neuroaccess:local-read-page", onLocalEvent)
    window.addEventListener("neuroaccess:local-stop-reading", onLocalEvent)
    window.addEventListener("neuroaccess:local-pause-reading", onLocalEvent)
    window.addEventListener("neuroaccess:local-resume-reading", onLocalEvent)

    return () => {
      runtime.onMessage.removeListener(onMessage)
      window.removeEventListener("neuroaccess:local-read-selection", onLocalEvent)
      window.removeEventListener("neuroaccess:local-read-page", onLocalEvent)
      window.removeEventListener("neuroaccess:local-stop-reading", onLocalEvent)
      window.removeEventListener("neuroaccess:local-pause-reading", onLocalEvent)
      window.removeEventListener("neuroaccess:local-resume-reading", onLocalEvent)
    }
  }, [])

  const contrastKey = JSON.stringify(settings.contrastFixer)
  useEffect(() => {
    if (settings.contrastFixer.enabled) {
      contrastFixerController.apply(settings.contrastFixer)
    } else {
      contrastFixerController.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contrastKey])

  const calmThemeKey = JSON.stringify(settings.calmTheme)
  useEffect(() => {
    if (settings.calmTheme.enabled) {
      calmThemeController.apply(settings.calmTheme)
    } else {
      calmThemeController.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calmThemeKey])

  const skipLinksKey = JSON.stringify(settings.skipLinks)
  useEffect(() => {
    if (settings.skipLinks.enabled) {
      skipLinksController.apply(settings.skipLinks)
    } else {
      skipLinksController.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipLinksKey])

  return (
    <>
      <RulerOverlay settings={settings.readingRuler} />
      <ReadingBarOverlay settings={settings.syllableHighlighting} />
      <VoiceCommandsOverlay settings={settings.voiceCommands} />
      <StandaloneReaderWidget ref={standaloneReaderRef} rate={settings.syllableHighlighting.speechRate} />
    </>
  )
}