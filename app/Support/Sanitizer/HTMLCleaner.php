<?php
namespace App\Support\Sanitizer;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;
use App\Support\Sanitizer\TextAlignStyleSanitizer;

class HTMLCleaner {

    private HtmlSanitizer $sanitizer;
    private const ALLOWED_TAGS = ['p','h1','h2','h3','ul','ol','li','hr','br','strong','em','s','u'];

    public function __construct(){

        $config = new HtmlSanitizerConfig();

        foreach(self::ALLOWED_TAGS as $tag){
            $config = $config->allowElement($tag);
        }

        $config = $config
        ->allowAttribute('style', ['p', 'h1', 'h2', 'h3'])
        ->withAttributeSanitizer(new TextAlignStyleSanitizer())
        ->withMaxInputLength(50000);

        $this->sanitizer = new HtmlSanitizer($config);
    }

    public function cleanTiptap(?string $html): ?string {

        if($html === null || trim($html) === ''){
            return null;
        }

        return $this->sanitizer->sanitize($html);
    }

}
