#!/bin/bash
cd /home/user/webapp/frontend

echo "프론트엔드 서버 시작 중..."

# 기존 프로세스 종료
pkill -f "vite" 2>/dev/null || true

# Vite 개발 서버 시작
npm run dev
