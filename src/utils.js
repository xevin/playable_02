
export function rotateArray(arr, startIndex) {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  const index = ((startIndex % arr.length) + arr.length) % arr.length;
  return [...arr.slice(index), ...arr.slice(0, index)];
}

export function getCyclicElement(arr, index) {
  // Проверка на пустой массив
  if (!arr || arr.length === 0) {
    return undefined;
  }

  // Вычисление циклического индекса
  const cyclicIndex = index % arr.length;

  // Для отрицательных индексов
  const normalizedIndex = cyclicIndex >= 0 ? cyclicIndex : arr.length + cyclicIndex;

  return arr[normalizedIndex];
}

// ====================================================
// 3. СИСТЕМА РЕДИРЕКТА И SDK
// ====================================================
export function triggerSDKDownload() {
  function isUrlValid(url) {
    if (!url || url.trim() === '') {
      return false;
    }

    const trimmedUrl = url.trim();

    return trimmedUrl !== 'about:blank';
  }

  const googlePlayUrl = typeof GOOGLE_PLAY_URL !== 'undefined' ? GOOGLE_PLAY_URL : '';
  const appStoreUrl = typeof APP_STORE_URL !== 'undefined' ? APP_STORE_URL : '';

  const hasValidGoogleUrl = isUrlValid(googlePlayUrl);
  const hasValidAppStoreUrl = isUrlValid(appStoreUrl);

  if (!hasValidGoogleUrl && !hasValidAppStoreUrl) {
    return;
  }

  const isAndroid = /Android/.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  let platformHasValidUrl = false;
  if (isAndroid && hasValidGoogleUrl) {
    platformHasValidUrl = true;
  } else if (isIOS && hasValidAppStoreUrl) {
    platformHasValidUrl = true;
  } else if (!isAndroid && !isIOS && (hasValidGoogleUrl || hasValidAppStoreUrl)) {
    platformHasValidUrl = true;
  }

  if (!platformHasValidUrl) {
    return;
  }

  if (typeof sdk !== 'undefined' && sdk.install) {
    try {
      sdk.install();
    } catch (e) {}
  }
  else if (window.sdk?.download) {
    window.sdk.download();
  } else if (window.sdk?.openStore) {
    window.sdk.openStore();
  } else if (window.mraid?.open) {
    const url = getPlatformSpecificUrl(googlePlayUrl, appStoreUrl, isAndroid, isIOS);
    if (url && isUrlValid(url)) {
      window.mraid.open(url);
    }
  } else if (window.CTAsdk?.install) {
    window.CTAsdk.install();
  } else if (window.fbPlayableAd?.onCTAClick) {
    window.fbPlayableAd.onCTAClick();
  } else {
    const url = getPlatformSpecificUrl(googlePlayUrl, appStoreUrl, isAndroid, isIOS);

    if (url && isUrlValid(url)) {
      window.open(url, '_blank');
    }
  }

  function getPlatformSpecificUrl(googleUrl, appleUrl, android, ios) {
    if (android && isUrlValid(googleUrl)) {
      return googleUrl;
    } else if (ios && isUrlValid(appleUrl)) {
      return appleUrl;
    } else {
      return isUrlValid(googleUrl) ? googleUrl :
        isUrlValid(appleUrl) ? appleUrl : '';
    }
  }
}
