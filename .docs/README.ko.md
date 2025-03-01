# Figmable

[English](README.md) | 한국어

Figmable은 Figma 디자인 파일의 컬러 변수를 CSS 파일과 직접 동기화하는 CLI 도구입니다. Figma에서 컬러 변수를 추출하고 CSS 파일을 자동으로 업데이트하여 디자인-개발 워크플로우를 원활하게 만듭니다.

## 특징

- 🎨 Figma 파일에서 컬러 변수 추출
- 🔄 CSS 파일과 자동 동기화
- 🔒 기존 CSS 변수 보존
- 💾 업데이트 전 CSS 파일 자동 백업
- 📦 워크플로우에 쉽게 통합
- ⚡️ 간단한 설정 관리

## 사전 준비사항

1. **Figma API 토큰**

   - Figma > 계정 설정 > Access tokens으로 이동
   - 새 액세스 토큰 생성
   - 토큰을 복사하여 보관

2. **Figma 파일 키**

   - 브라우저에서 Figma 파일 열기
   - URL에서 키 복사: `figma.com/file/YOUR_FILE_KEY/...`

3. **CSS 파일**
   - `@layer base`와 `:root` 구조가 필요
   - 예시:
     ```css
     @layer base {
       :root {
         /* CSS 변수가 여기에 추가됩니다 */
         --primary: #000000;
       }
     }
     ```

## 설치

```bash
npm install -g figmable
```

## 사용법

### 1. 설정 저장

먼저 Figma 인증 정보와 파일 경로를 저장합니다:

```bash
figmable config \
  --fileKey YOUR_FIGMA_FILE_KEY \
  --token YOUR_FIGMA_API_TOKEN \
  --path ./path/to/your/global.css
```

### 2. 현재 설정 확인

저장된 설정을 확인합니다:

```bash
figmable show
```

다음 정보가 표시됩니다:

- Figma 파일 키와 URL
- API 토큰
- 파일 경로
- 설정 파일 위치 (직접 수정 가능)

### 3. 변수 동기화

설정 후 간단히 실행:

```bash
figmable
```

실행 시:

1. Figma 파일에서 컬러 변수를 가져옵니다
2. `figma-variables.json`에 저장합니다
3. CSS 파일을 업데이트합니다
4. CSS 파일의 백업을 생성합니다 (`.bak`)

### 고급 사용법

단일 실행 시 설정 덮어쓰기:

```bash
figmable \
  --fileKey DIFFERENT_KEY \
  --token DIFFERENT_TOKEN \
  --path ./different/path.css \
  --output ./different/variables.json
```

## 파일 구조

- `.figmablerc`: 설정 파일 (홈 디렉토리에 자동 생성)
- `figma-variables.json`: 추출된 Figma 변수 (프로젝트 디렉토리에 생성)
- `your-css-file.css.bak`: 백업 파일 (CSS 파일 옆에 생성)

## 오류 처리

Figmable은 다음과 같은 일반적인 문제에 대해 명확한 오류 메시지를 제공합니다:

- 유효하지 않은 Figma API 토큰
- 파일 접근 권한
- 누락되거나 유효하지 않은 파일 경로
- JSON 파싱 오류
- CSS 파일 수정 오류

## 기여

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해주세요.

## 라이선스

MIT

## 작성자

Byungsker
