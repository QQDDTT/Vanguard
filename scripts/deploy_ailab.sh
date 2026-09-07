#!/usr/bin/env bash
set -eo pipefail

echo "==> 准备提交流水线至 GCP evotensor-ai-lab 进行云端构建与部署..."

GCP_PROJECT="evotensor-ai-lab"

gcloud builds submit --project "$GCP_PROJECT" --config infra/cloudbuild.yaml .

echo "==> 部署已成功拉起并触发！"
