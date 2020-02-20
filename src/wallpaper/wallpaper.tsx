import React from 'react'
import { Navbar, Html, Head, OpenGraph, Body, Footer, Consultation } from '../layout.v3'
import { join } from 'path'
import { getOpenGraph, getPages, getConfig, State, Actions, Action, getBlogPosts, hasTag } from '../store'
import { defaultAssetsPipeline } from '../optimise'
import { Store } from 'redux'
import { tachyons } from '../tachyons/tachyons'
import { content, Wallpaper as WallpaperType } from './content'

export const Wallpaper = {
  id: 'wallpaper',
  url: '/wallpaper',
  title: 'Download Wallpaper ⎈ Learnk8s',
  description: 'Free Tools  -  Download Desktop Wallpaper and Cover',
}

export function Register(store: Store<State, Actions>) {
  store.dispatch(Action.registerPage(Wallpaper))
  store.dispatch(
    Action.registerOpenGraph({
      id: 'og-wallpaper',
      pageId: Wallpaper.id,
      image: <img src='assets/open_graph_preview.png' alt='Learnk8s preview' />,
      title: 'Download Wallpaper',
      description: 'Free Tools  -  Download Desktop Wallpaper and Cover',
    }),
  )
}

export function Mount({ store }: { store: Store<State, Actions> }) {
  const state = store.getState()
  defaultAssetsPipeline({
    jsx: renderPage(state),
    isOptimisedBuild: getConfig(state).isProduction,
    siteUrl: `${getConfig(state).protocol}://${getConfig(state).hostname}`,
    url: Wallpaper.url,
    outputFolder: getConfig(state).outputFolder,
  })
}

function renderPage(state: State) {
  const pages = getPages(state)
  const page = pages.find(it => it.id === Wallpaper.id)!
  const openGraph = getOpenGraph(state).find(it => it.pageId === Wallpaper.id)
  const currentAbsoluteUrl = `${state.config.protocol}://${join(state.config.hostname, page.url)}`
  const wallpaperList = Object.values(content).map((it, i) => (
    <DownloadListItem className='db w-100 mb4' item={it} key={i} />
  ))
  return (
    <Html>
      <Head title={page.title} description={page.description}>
        {openGraph ? (
          <OpenGraph
            title={openGraph.title}
            description={openGraph.description}
            image={openGraph.image}
            currentAbsoluteUrl={currentAbsoluteUrl}
          />
        ) : null}
        <style>{tachyons}</style>
        <link rel='stylesheet' href='assets/style.css' />
        <link rel='canonical' href={currentAbsoluteUrl} />
      </Head>

      <Body>
        <Navbar />

        <section className='ph3 pv4 center'>
          <ul className='flex flex-wrap items-start list pl0 bt bw2 b--near-white pt4'>{wallpaperList}</ul>
        </section>

        <Consultation />
        <Footer />
      </Body>
    </Html>
  )
}

const DownloadListItem: React.StatelessComponent<{
  className?: string
  item: WallpaperType
  key: number
}> = ({ children, className, item, key }) => {
  const items = item.downloadList.map((it, i) => (
    <li key={i}>
      <a href={it.url} download className='underline-hover black'>
        {it.text}
      </a>
    </li>
  ))
  return (
    <li className={`${className || ''}`} key={key}>
      <div className='relative w-40-l dib v-top w-100'>
        <div className='aspect-ratio aspect-ratio--7x5'>
          {React.createElement('img', {
            src: item.featureImg.props.src,
            alt: item.featureImg.props.alt,
            loading: 'lazy',
            className: 'aspect-ratio--object br2 br--top z-1',
          })}
        </div>
      </div>
      <div className='ph3 pt3 w-60-l dib v-top w-100'>
        <h3 className='f3 lh-solid mt3 navy'>{item.title}</h3>
        <ul>{items}</ul>
      </div>
    </li>
  )
}
