<?php

namespace Microlise\SurveyBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class MicroliseSurveyBundle extends Bundle
{
    public function getParent()
    {
        return 'FOSUserBundle';
    }
}
