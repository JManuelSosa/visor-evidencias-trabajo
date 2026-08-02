<?php
namespace App\Support\Sanitizer;

use Override;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;
use Symfony\Component\HtmlSanitizer\Visitor\AttributeSanitizer\AttributeSanitizerInterface;

class TextAlignStyleSanitizer implements AttributeSanitizerInterface {

    private const ALLOWED = ['left', 'center', 'right', 'justify'];

    #[Override]
    public function getSupportedElements(): ?array {
        return ['p', 'h1', 'h2', 'h3'];
    }

    #[Override]
    public function getSupportedAttributes(): ?array {
        return ['style'];
    }

    #[Override]
    public function sanitizeAttribute(string $element, string $attribute, string $value, HtmlSanitizerConfig $config): ?string {
        if (preg_match('/^text-align:\s*(left|center|right|justify);?$/i', trim($value), $m)) {
            return 'text-align: ' . strtolower($m[1]) . ';';
        }

        return null;
    }

}
