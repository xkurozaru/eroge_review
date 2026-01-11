.PHONY: help gen-openapi gen-ts-schema gen-all

# for terminal output
GREEN   := \033[0;32m
GREEN_B := \033[1;32m
BLUE    := \033[0;34m
YELLOW  := \033[0;33m
RESET   := \033[0m

help:
	@echo ""
	@echo "$(BLUE)📚 Available targets:$(RESET)"
	@echo ""
	@echo "  $(GREEN)gen-openapi$(RESET)    - 🔄 Generate OpenAPI specs (showcase.yaml, console.yaml)"
	@echo "  $(GREEN)gen-ts-schema$(RESET)  - 📝 Generate TypeScript schemas from OpenAPI"
	@echo "  $(GREEN)gen-all$(RESET)        - ✨ Generate both OpenAPI specs and TypeScript schemas"
	@echo ""

gen-openapi:
	@echo ""
	@echo "$(BLUE)🔄 Generating OpenAPI specs...$(RESET)"
	@echo ""
	@cd eroge_review_server && bash scripts/export_openapi.sh showcase ../openapi/showcase.yaml
	@echo "> bash scripts/export_openapi.sh showcase ../openapi/showcase.yaml"
	@echo "$(GREEN)🚀 src/eroge_review_server/showcase/server.py → $(GREEN_B)../openapi/showcase.yaml$(RESET)"
	@echo ""
	@cd eroge_review_server &&  bash scripts/export_openapi.sh console ../openapi/console.yaml
	@echo "> bash scripts/export_openapi.sh console ../openapi/console.yaml"
	@echo "$(GREEN)🚀 src/eroge_review_server/console/server.py → $(GREEN_B)../openapi/console.yaml$(RESET)"

gen-ts-schema:
	@echo ""
	@echo "$(BLUE)📝 Generating TypeScript schemas...$(RESET)"
	@cd eroge_review_web/eroge_review_console && npm run gen:api
	@cd eroge_review_web/eroge_review_showcase && npm run gen:api

gen-all: gen-openapi gen-ts-schema
	@echo ""
	@echo "$(GREEN_B)🎉 All schemas generated successfully!$(RESET)"
