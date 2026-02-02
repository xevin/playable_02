import { Texture } from "pixi.js";

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

export function loadTextureFromBase64(base64Data) {
  return new Promise((resolve) => {
    try {
      const cleanBase64 = base64Data.replace(/\s/g, '');
      const img = new Image();

      img.onload = () => {
        resolve(Texture.from(img));
      };

      img.onerror = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FF00FF';
          ctx.fillRect(0, 0, 100, 100);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px Arial';
          ctx.fillText('Player', 20, 50);
        }

        resolve(Texture.from(canvas));
      };

      img.src = cleanBase64;
    } catch (error) {
      resolve(Texture.EMPTY);
    }
  });
}

export async function loadCustomFont(fontBase64Data) {
  return new Promise((resolve) => {
    try {
      // Создаем стиль для загрузки шрифта
      const fontFace = new FontFace(
        'CustomFont',
        `url(${fontBase64Data})`,
        {
          style: 'normal',
          weight: '400'
        }
      );

      fontFace.load().then((loadedFont) => {
        // Добавляем шрифт в документ
        document.fonts.add(loadedFont);
        console.log('Шрифт успешно загружен');
        resolve(true);
      }).catch((error) => {
        console.error('Ошибка загрузки шрифта:', error);
        resolve(false);
      });

    } catch (error) {
      console.error('Ошибка при загрузке шрифта:', error);
      resolve(false);
    }
  });
}
