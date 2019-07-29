import { Settings } from 'luxon'

App({
  onLaunch() {
    Settings.defaultLocale = 'zh-CN'
  }
})
