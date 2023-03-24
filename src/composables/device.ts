export const useDevice = () => {
  const { userAgent } = window.navigator

  const { orientation } = useScreenOrientation()

  const isMobile = readonly(ref(/iPhone|iPad|iPod|Android/i.test(userAgent)))
  const isTablet = readonly(ref(/iPad/i.test(userAgent)))
  const isDesktop = readonly(ref(!isMobile && !isTablet))

  const inLandscape = computed(() => orientation.value?.startsWith('landscape'))

  return {
    isMobile,
    isDesktop,
    isTablet,
    inLandscape
  }
}
