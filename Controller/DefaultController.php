<?php

namespace Microlise\SurveyBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('MicroliseSurveyBundle:Default:index.html.twig', array('name' => $name));
    }
}
