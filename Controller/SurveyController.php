<?php
/**
 * Created by PhpStorm.
 * User: niaz
 * Date: 23/03/15
 * Time: 14:31
 */

namespace Microlise\SurveyBundle\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Microlise\SurveyBundle\Entity\Survey;
use Microlise\SurveyBundle\Entity\Question;
use Microlise\SurveyBundle\Entity\Answer;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Microlise\SurveyBundle\Form\Type\SurveyType;

class SurveyController extends controller
{
    public function indexAction()
    {
        $name = "hello niaz";

        $oldsurveys = "survey1, survey2";

        return $this->render(
            'MicroliseSurveyBundle:Survey:index.html.twig',
            array('name' => $name, 'oldsurveys' => $oldsurveys)
        );

    }

    public function createAction(Request $request)
    {

     /*   $survey = new Survey();
        $survey->setName('Test Survey1');
        $survey->setDescription('Lorem ipsum dolor');

        $em = $this->getDoctrine()->getManager();

        $em->persist($survey);
        $em->flush();

        return new Response('Created survey id '.$survey->getId());*/

// create a task and give it some dummy data for this example

        $id = uniqid();
//print_r($id);
        $survey = new Survey();

        $surveyform = $this->createForm('survey', $survey);
       // $surveyform = $this->createForm(new SurveyType(), $survey);

    /*    $surveyform = $this->createFormBuilder($survey)
            ->add('name', 'text')
            ->add('description', 'text')
            ->add('uniqueid', $id)
            ->add('save', 'submit', array('label' => 'Next'))
            ->getForm();*/
        $surveyform->handleRequest($request);

        if ($surveyform->isValid()) {

            $em = $this->getDoctrine()->getManager();

            $em->persist($survey);
            $em->flush();
          //  $this->questionAction($request, $id);

            return $this->redirect($this->generateUrl('microlise_survey_create_question'));
        }



       // $id = $survey->getId();

        return $this->render('MicroliseSurveyBundle:Survey:create.html.twig', array(
            'surveyform' => $surveyform->createView(),

        ));

    }

    public function questionAction(Request $request)
    {
        $survey = new Survey();
        $id = uniqid();
        print_r($id);
        $question = new Question();

        $questionform = $this->createFormBuilder($question)
            ->add('question', 'text')
            ->add('surveyid', 'text')
            ->add('save', 'submit', array('label' => 'Next'))
            ->getForm();
        $questionform->handleRequest($request);

        if ($questionform->isValid()) {

            $em = $this->getDoctrine()->getManager();

            $em->persist($question);
            $em->flush();

            return $this->redirect($this->generateUrl('microlise_survey_create'));
        }

        return $this->render('MicroliseSurveyBundle:Survey:questions.html.twig', array(
            'questionform' => $questionform->createView(),
        ));

    }

    public function displayAction($id)
    {
        $repository = $this->getDoctrine()
            ->getRepository('SurveyBundle:Survey');
        $survey = $repository->findAll();
print_r($survey);
    }



    public function buildSurveyAction()
    {

        $repository = $this->getDoctrine()
            ->getRepository('MicroliseSurveyBundle:Survey');
        $survey = $repository->findAll();
        print_r($survey);

        return $this->render(
            'MicroliseSurveyBundle:Survey:create.html.twig',
            array()
        );
    }

    public function analyticsAction()
    {

    }

}