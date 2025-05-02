<?php

$paths = [__DIR__.'/src'];

if (is_dir(__DIR__.'/tests')) {
    $paths[] = __DIR__.'/tests';
}

$finder = (new PhpCsFixer\Finder())
    ->in($paths)
    ->exclude('var')
;

return (new PhpCsFixer\Config())
    ->setRules([
        '@Symfony' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => true,
        'no_unused_imports' => true,
        'phpdoc_order' => true,
        'phpdoc_summary' => false,
        'php_unit_method_casing' => ['case' => 'snake_case'],
    ])
    ->setFinder($finder)
;
