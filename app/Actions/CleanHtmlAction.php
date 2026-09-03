<?php
namespace App\Actions;

use App\Support\Sanitizer\HTMLCleaner;

class CleanHtmlAction {

    public function __construct(private HTMLCleaner $cleaner){}

    public function __invoke(string $html) {
        return $this->cleaner->cleanTiptap($html);
    }
}
