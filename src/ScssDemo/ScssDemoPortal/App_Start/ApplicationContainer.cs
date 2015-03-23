using LibSassNet;

namespace ScssDemoPortal.App_Start
{
    public class ApplicationContainer
    {
        private static SassCompiler sassCompiler;

        public static SassCompiler SassCompiler
        {
            get
            {
                if (sassCompiler == null)
                {
                    sassCompiler = new SassCompiler();
                }
                return sassCompiler;
            }
        }
    }
}