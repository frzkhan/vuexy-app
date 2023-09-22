import appAndPages from './app-and-pages'
import forms from './forms'
import uiElements from './ui-elements'

// export default [...dashboard, ...appAndPages, ...uiElements, ...forms, ...charts, ...others]
export default [
  {
    title: 'Dashboard',
    icon: { icon: 'tabler-smart-home' },
    to: 'dashboards-analytics',
  },
  {
    title: 'Order Sheet',
    icon: { icon: 'tabler-list' },
    
    to: 'apps-order',
  },

  // ...dashboard,
  ...appAndPages,

  ...uiElements,
  ...forms,

  // ...charts,
  // ...others,
]
