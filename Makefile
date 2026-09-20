.PHONY: all clean install build-frontend bundle-lambdas init plan apply deploy upload-frontend

TERRAFORM_DIR := terraform
FRONTEND_OUT  := out
LAMBDA_SRC    := infra/lambda
LAMBDA_DIST   := $(TERRAFORM_DIR)/dist

all: install build-frontend bundle-lambdas

install:
	npm install
	cd infra && npm install

build-frontend:
	npm run build

bundle-lambdas:
	mkdir -p $(LAMBDA_DIST)/webhook $(LAMBDA_DIST)/processor $(LAMBDA_DIST)/reader
	npx esbuild $(LAMBDA_SRC)/webhook.ts --bundle --platform=node --target=node22 --outfile=$(LAMBDA_DIST)/webhook/index.js --external:@aws-sdk/*
	npx esbuild $(LAMBDA_SRC)/processor.ts --bundle --platform=node --target=node22 --outfile=$(LAMBDA_DIST)/processor/index.js --external:@aws-sdk/*
	npx esbuild $(LAMBDA_SRC)/reader.ts --bundle --platform=node --target=node22 --outfile=$(LAMBDA_DIST)/reader/index.js --external:@aws-sdk/*

init:
	cd $(TERRAFORM_DIR) && terraform init

plan: all init
	cd $(TERRAFORM_DIR) && terraform plan -out=tfplan

apply: plan
	cd $(TERRAFORM_DIR) && terraform apply tfplan

upload-frontend:
	cd $(TERRAFORM_DIR) && \
		aws s3 sync ../$(FRONTEND_OUT) s3://$$(terraform output -raw s3_bucket_name) --delete

deploy: apply upload-frontend

clean:
	rm -rf $(FRONTEND_OUT) $(LAMBDA_DIST) $(TERRAFORM_DIR)/.terraform $(TERRAFORM_DIR)/tfplan
