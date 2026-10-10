# potential

Vite의 vanilla-ts 템플릿으로 만든 TypeScript 프로젝트입니다.

## 로고 인트로

페이지 진입 시 로고가 화면 중앙에 크게 나타났다가 왼쪽 위로 이동합니다.
0.4초 동안 나타나고 중앙에서 1.5초 머문 뒤, 0.7초 동안 왼쪽 위로 이동합니다.
`Shop`, `About`, `Archive` 메뉴는 인트로 동안 숨겨지고,
로고가 상단에 도착하면 즉시 표시됩니다.
동작 줄이기 설정을 사용하면 바로 왼쪽 위에 표시합니다.
화면 크기가 변경되면 애니메이션을 종료하고 헤더 위치에 고정합니다.

원본 로고 이미지는 `public/potential-logo.png`에 넣으세요.
이미지를 불러온 뒤 인트로가 시작됩니다. 이미지 로드에 실패하면
`POTENTIAL` 텍스트를 대신 표시합니다.

## 로컬 사용

Node.js 24 기준:

```sh
npm ci
npm run dev
```

빌드: `npm run build` (결과: `dist/`).

## GitHub Pages 배포

1. GitHub의 `Wanseo/potential` 저장소에서 **Settings → Pages**로 이동합니다.
2. **Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. 변경된 소스와 `.github/workflows/deploy.yml`을 커밋하고 `main`에 푸시합니다.
4. **Actions → Deploy to GitHub Pages**에서 실행 결과를 확인합니다.
   수동 배포는 **Run workflow**로 실행할 수 있습니다.

배포 주소: https://wanseo.github.io/potential/

워크플로는 Node.js 24에서 `npm ci`와 `npm run build`를 실행하고
`dist/`를 Pages에 배포합니다. 별도 토큰이나 Secrets는 필요하지 않습니다.
`dist/`와 `node_modules/`는 커밋하지 않습니다.

## 파일 경로

`vite.config.ts`의 `base`는 `/potential/`입니다. 저장소 이름이 바뀌면
이 값도 변경하세요. 사용자 사이트(`wanseo.github.io`) 또는 커스텀 도메인에
배포한다면 `/`로 변경합니다.

- `src/assets/` 파일은 TypeScript에서 `import`하여 사용합니다.
- `public/` 파일은 TypeScript에서
  `${import.meta.env.BASE_URL}파일명`으로 참조합니다.
- HTML의 public 파일은 `%BASE_URL%파일명`으로 참조할 수 있습니다.
- `templates/`는 템플릿 보관 폴더이며 자동으로 배포되지 않습니다.
